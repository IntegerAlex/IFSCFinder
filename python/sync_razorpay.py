#!/usr/bin/env python3
"""
Sync IFSC data from Razorpay's repo and compare with the existing SQLite database.

Usage:
    python sync_razorpay.py [--download] [--report]

    --download    Download all JSON files from Razorpay (cached after first download)
    --report      Generate comparison report only (uses cached/downloaded data)
    --sync        Also update the SQLite database with new records (backward compatible)
"""

import json
import os
import sqlite3
import sys
import urllib.request
import urllib.error
import argparse
from datetime import datetime
from pathlib import Path

RAZORPAY_DATA_URL = "https://raw.githubusercontent.com/razorpay/ifsc-api/master/data"
RAZORPAY_API_URL = "https://api.github.com/repos/razorpay/ifsc-api/contents/data"

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "src" / "ifscfinder" / "data" / "ifsc.db"
TS_DB_PATH = HERE.parent / "clients" / "typescript" / "assets" / "ifsc.db"
CACHE_DIR = HERE / ".razorpay_cache"
REPORT_DIR = HERE / "reports"


def get_json_file_list():
    """Fetch the list of JSON files from the Razorpay repo."""
    req = urllib.request.Request(RAZORPAY_API_URL)
    with urllib.request.urlopen(req) as resp:
        files = json.loads(resp.read().decode())
    return [f for f in files if f["name"].endswith(".json")]


def download_file(url, dest_path):
    """Download a single file from URL to dest_path."""
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    dest_path.write_bytes(data)
    return data


def download_all_json(files):
    """Download all JSON files to cache directory."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    total = len(files)
    downloaded = 0
    for i, f in enumerate(files, 1):
        name = f["name"]
        dest = CACHE_DIR / name
        if dest.exists() and dest.stat().st_size == f["size"]:
            continue
        print(f"  [{i}/{total}] Downloading {name} ({f['size']} bytes)...")
        try:
            download_file(f["download_url"], dest)
            downloaded += 1
        except Exception as e:
            print(f"  [!] Failed to download {name}: {e}")
    if downloaded:
        print(f"  Downloaded {downloaded} new/changed files")
    else:
        print(f"  All {total} files already cached")
    return total


def parse_razorpay_data():
    """Parse all cached JSON files and return a dict of IFSC -> record mappings."""
    all_records = {}
    bank_counts = {}
    errors = []
    for json_file in sorted(CACHE_DIR.glob("*.json")):
        bank_code = json_file.stem
        try:
            data = json.loads(json_file.read_text())
            if not isinstance(data, dict):
                errors.append(f"{json_file.name}: top-level is not a dict")
                continue
            count = 0
            for ifsc, record in data.items():
                all_records[ifsc] = record
                count += 1
            bank_counts[bank_code] = count
        except json.JSONDecodeError as e:
            errors.append(f"{json_file.name}: JSON error: {e}")
        except Exception as e:
            errors.append(f"{json_file.name}: {e}")
    return all_records, bank_counts, errors


def get_existing_codes(db_path):
    """Return set of all IFSC codes currently in the SQLite database."""
    conn = sqlite3.connect(str(db_path))
    cursor = conn.execute("SELECT code FROM ifsc_codes")
    codes = set(row[0] for row in cursor.fetchall())
    conn.close()
    return codes


def compute_mismatches(db_path, razorpay_records):
    """Compare razorpay records with the DB and return detailed diff info."""
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row

    existing_codes = set()
    cursor = conn.execute("SELECT * FROM ifsc_codes")
    for row in cursor.fetchall():
        existing_codes.add(row["code"])

    razorpay_codes = set(razorpay_records.keys())

    # Codes in Razorpay but not in DB
    missing_codes = razorpay_codes - existing_codes
    # Codes in DB but not in Razorpay (stale/removed)
    extra_codes = existing_codes - razorpay_codes
    # Codes in both
    common_codes = razorpay_codes & existing_codes

    # Detailed field diffs for common codes
    field_diffs = {"bank": 0, "branch": 0, "address": 0, "city": 0, "state": 0}
    diff_examples = {k: [] for k in field_diffs}

    for code in common_codes:
        razor = razorpay_records[code]
        cursor.execute("SELECT * FROM ifsc_codes WHERE code = ?", (code,))
        row = dict(cursor.fetchone())

        db_bank = (row.get("bank") or "").strip().upper()
        db_branch = (row.get("branch") or "").strip().upper()
        db_address = (row.get("address") or "").strip().upper()
        db_city = (row.get("city1") or "").strip().upper()
        db_state = (row.get("state") or "").strip().upper()

        rz_bank = (razor.get("BANK") or "").strip().upper()
        rz_branch = (razor.get("BRANCH") or "").strip().upper()
        rz_address = (razor.get("ADDRESS") or "").strip().upper()
        rz_city = (razor.get("CITY") or "").strip().upper()
        rz_state = (razor.get("STATE") or "").strip().upper()

        if db_bank != rz_bank:
            field_diffs["bank"] += 1
            if len(diff_examples["bank"]) < 5:
                diff_examples["bank"].append((code, db_bank, rz_bank))
        if db_branch != rz_branch:
            field_diffs["branch"] += 1
            if len(diff_examples["branch"]) < 5:
                diff_examples["branch"].append((code, db_branch, rz_branch))
        if db_address != rz_address:
            field_diffs["address"] += 1
            if len(diff_examples["address"]) < 5:
                diff_examples["address"].append((code, db_address[:60], rz_address[:60]))
        if db_city != rz_city and rz_city != "NA":
            field_diffs["city"] += 1
            if len(diff_examples["city"]) < 5:
                diff_examples["city"].append((code, db_city, rz_city))
        if db_state != rz_state and rz_state != "NA":
            field_diffs["state"] += 1
            if len(diff_examples["state"]) < 5:
                diff_examples["state"].append((code, db_state, rz_state))

    conn.close()
    return {
        "existing_count": len(existing_codes),
        "razorpay_count": len(razorpay_codes),
        "common_count": len(common_codes),
        "missing_count": len(missing_codes),
        "extra_count": len(extra_codes),
        "missing_codes": sorted(missing_codes),
        "extra_codes": sorted(extra_codes),
        "field_diffs": field_diffs,
        "diff_examples": diff_examples,
    }


def generate_report(mismatches, bank_counts, errors):
    """Generate a detailed text report."""
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = REPORT_DIR / f"sync_report_{timestamp}.txt"
    summary_path = REPORT_DIR / "sync_report_latest.txt"

    lines = []
    lines.append("=" * 72)
    lines.append("  IFSCFinder - Razorpay Sync Report")
    lines.append(f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("=" * 72)
    lines.append("")
    lines.append("SUMMARY")
    lines.append("-" * 40)
    lines.append(f"  Records in existing DB:       {mismatches['existing_count']:>8,}")
    lines.append(f"  Records in Razorpay data:     {mismatches['razorpay_count']:>8,}")
    lines.append(f"  Records in common:            {mismatches['common_count']:>8,}")
    lines.append(f"  Records MISSING from DB:      {mismatches['missing_count']:>8,}")
    lines.append(f"  Records EXTRA in DB (stale):  {mismatches['extra_count']:>8,}")
    lines.append("")
    lines.append("Net change if synced:")
    net = mismatches['razorpay_count'] - mismatches['existing_count']
    if net >= 0:
        lines.append(f"  +{net:,} new records would be added")
    else:
        lines.append(f"  {net:,} records would be removed")
    lines.append("")

    # Bank-wise counts from Razorpay
    lines.append("BANK-WISE BREAKDOWN (Razorpay)")
    lines.append("-" * 40)
    sorted_banks = sorted(bank_counts.items(), key=lambda x: -x[1])
    for bank_code, count in sorted_banks:
        lines.append(f"  {bank_code:8s}: {count:>6,} records")
    lines.append("")

    # Field differences
    fd = mismatches["field_diffs"]
    lines.append("FIELD-LEVEL DIFFERENCES (common records)")
    lines.append("-" * 40)
    for field, count in fd.items():
        pct = (count / mismatches["common_count"] * 100) if mismatches["common_count"] else 0
        lines.append(f"  {field:10s}: {count:>8,} different ({pct:.1f}%)")
    lines.append("")

    # Examples of field diffs
    if any(mismatches["diff_examples"].values()):
        lines.append("SAMPLE DIFFERENCES")
        lines.append("-" * 40)
        for field, examples in mismatches["diff_examples"].items():
            if examples:
                lines.append(f"\n  {field.upper()} differences:")
                for code, old, new in examples:
                    lines.append(f"    {code}: DB='{old}' vs RZ='{new}'")
    lines.append("")

    # Missing codes (first 100)
    if mismatches["missing_codes"]:
        lines.append(f"MISSING IFSC CODES (showing first 100 of {mismatches['missing_count']})")
        lines.append("-" * 40)
        for code in mismatches["missing_codes"][:100]:
            rec = razorpay_records.get(code, {})
            bank = rec.get("BANK", "?")
            branch = rec.get("BRANCH", "?")
            lines.append(f"  {code} | {bank} | {branch}")
        if mismatches["missing_count"] > 100:
            lines.append(f"  ... and {mismatches['missing_count'] - 100} more")
    lines.append("")

    # Extra codes (stale in DB)
    if mismatches["extra_codes"]:
        lines.append(f"EXTRA CODES IN DB (not in Razorpay) — {mismatches['extra_count']}")
        lines.append("-" * 40)
        for code in mismatches["extra_codes"][:50]:
            lines.append(f"  {code}")
        if mismatches["extra_count"] > 50:
            lines.append(f"  ... and {mismatches['extra_count'] - 50} more")
    lines.append("")

    # Errors
    if errors:
        lines.append("PARSING ERRORS")
        lines.append("-" * 40)
        for err in errors:
            lines.append(f"  {err}")
        lines.append("")

    lines.append("=" * 72)
    report_text = "\n".join(lines)

    report_path.write_text(report_text)
    summary_path.write_text(report_text)
    print(f"\nReport saved to: {report_path}")
    print(f"Latest report:   {summary_path}")
    return report_text


def sync_database(db_path, razorpay_records, missing_codes, dry_run=True):
    """Insert missing records into the SQLite database."""
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    added = 0
    skipped = 0
    for code in missing_codes:
        rec = razorpay_records[code]
        bank = (rec.get("BANK") or "").strip()
        branch = (rec.get("BRANCH") or "").strip()
        address = (rec.get("ADDRESS") or "").strip()
        city1 = (rec.get("CITY") or "").strip()
        city2 = (rec.get("CENTRE") or "").strip()
        state = (rec.get("STATE") or "").strip()
        std_code = (rec.get("CONTACT") or "")
        if isinstance(std_code, int):
            std_code = str(std_code)
        std_code = std_code.strip() if std_code else ""

        if not code or not bank:
            skipped += 1
            continue

        try:
            cursor.execute(
                """INSERT OR IGNORE INTO ifsc_codes
                   (code, bank, branch, address, city1, city2, state, std_code)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (code, bank, branch, address, city1, city2, state, std_code),
            )
            if cursor.rowcount > 0:
                added += 1
        except sqlite3.Error as e:
            print(f"  [!] DB error inserting {code}: {e}")

    conn.commit()
    conn.close()
    return added, skipped


def get_bank_name(bank_code):
    """Map a 4-letter bank code to a human-readable name from sample data."""
    mapping = {
        "SBIN": "State Bank of India",
        "HDFC": "HDFC Bank",
        "ICIC": "ICICI Bank",
        "PNBN": "Punjab National Bank",
        "BKID": "Bank of India",
        "CBIN": "Central Bank of India",
        "CNRB": "Canara Bank",
        "BARB": "Bank of Baroda",
        "UBIN": "Union Bank of India",
        "INDB": "IndusInd Bank",
        "AXIS": "Axis Bank",
        "YESB": "Yes Bank",
        "KOTB": "Kotak Mahindra Bank",
        "FDRL": "Federal Bank",
        "IDIB": "Indian Bank",
        "IOBA": "Indian Overseas Bank",
        "PSIB": "Punjab & Sind Bank",
        "SBMY": "State Bank of Mysore",
        "SBTR": "State Bank of Travancore",
        "SBHY": "State Bank of Hyderabad",
        "SBBJ": "State Bank of Bikaner & Jaipur",
        "SBIN": "State Bank of India",
        "ESFB": "Equitas Small Finance Bank",
        "AUBL": "AU Small Finance Bank",
        "UTIB": "Axis Bank (UTI)",
        "BDBL": "Bandhan Bank",
        "IDFC": "IDFC First Bank",
        "DCBL": "DCB Bank",
        "RATN": "RBL Bank",
        "KKBK": "Kotak Mahindra Bank",
        "JSFB": "Jana Small Finance Bank",
        "TJSB": "TJSB Sahakari Bank",
        "SVCB": "SVC Co-operative Bank",
        "APBL": "Andhra Pradesh State Co-op Bank",
        "GSCB": "Gujarat State Co-op Bank",
        "HSBC": "HSBC Bank",
        "CITI": "Citibank",
        "STBP": "State Bank of Patiala",
        "ALLA": "Allahabad Bank",
        "ANDB": "Andhra Bank",
        "CORP": "Corporation Bank",
        "SYNB": "Syndicate Bank",
        "ORBC": "Oriental Bank of Commerce",
        "UNI0": "United Bank of India",
        "VIJB": "Vijaya Bank",
        "DHNB": "Dhanlaxmi Bank",
        "KARB": "Karnataka Bank",
        "KVBL": "Karur Vysya Bank",
        "SDCE": "Sardar Vallabhbhai Sahakari Bank",
        "SIBL": "South Indian Bank",
        "SRCB": "Saraswat Co-operative Bank",
        "TNCB": "Tamilnadu Mercantile Bank",
        "UCBA": "UCO Bank",
    }
    return mapping.get(bank_code, bank_code)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync IFSC data from Razorpay")
    parser.add_argument("--download", action="store_true", help="Download JSON files from Razorpay")
    parser.add_argument("--report", action="store_true", help="Generate comparison report")
    parser.add_argument("--sync", action="store_true", help="Update SQLite DB with new records")
    parser.add_argument("--no-dry-run", action="store_true", help="Actually sync (bypass dry-run)")
    args = parser.parse_args()

    if not any(vars(args).values()) or args.download or args.report or args.sync:
        print("=" * 72)
        print("  IFSCFinder - Razorpay Sync Tool")
        print("=" * 72)

        # Step 1: Get file list
        print("\n[1] Fetching file list from Razorpay repo...")
        files = get_json_file_list()
        print(f"  Found {len(files)} JSON files ({sum(f['size'] for f in files):,} bytes total)")

        # Step 2: Download files
        if args.download:
            print("\n[2] Downloading JSON files...")
            download_all_json(files)
        elif not CACHE_DIR.exists() or not any(CACHE_DIR.glob("*.json")):
            print("\n[2] No cached data found. Downloading...")
            download_all_json(files)
        else:
            cached = len(list(CACHE_DIR.glob("*.json")))
            print(f"\n[2] Using {cached} cached files from {CACHE_DIR}")

        # Step 3: Parse all data
        print("\n[3] Parsing Razorpay data...")
        razorpay_records, bank_counts, errors = parse_razorpay_data()
        print(f"  Parsed {len(razorpay_records):,} IFSC records across {len(bank_counts)} banks")
        if errors:
            print(f"  {len(errors)} errors encountered")

        # Step 4: Compare with existing DB
        print("\n[4] Comparing with existing SQLite database...")
        if not DB_PATH.exists():
            print(f"  [!] DB not found at {DB_PATH}")
            sys.exit(1)
        mismatches = compute_mismatches(DB_PATH, razorpay_records)
        print(f"  Existing DB: {mismatches['existing_count']:,} records")
        print(f"  Razorpay:    {mismatches['razorpay_count']:,} records")
        print(f"  Common:      {mismatches['common_count']:,} records")
        print(f"  Missing:     {mismatches['missing_count']:,} records")
        print(f"  Extra:       {mismatches['extra_count']:,} records")
        print(f"  Field diffs: {sum(mismatches['field_diffs'].values()):,} total")

        # Step 5: Generate report
        print("\n[5] Generating report...")
        report_text = generate_report(mismatches, bank_counts, errors)
        print(report_text)

        # Step 6: Optionally sync
        if args.sync:
            print("\n[6] Syncing database...")
            if not args.no_dry_run:
                print("  DRY RUN - no changes made")
                print(f"  Would add: {len(mismatches['missing_codes']):,} new records")
            else:
                print(f"  Updating {DB_PATH}...")
                added, skipped = sync_database(
                    DB_PATH, razorpay_records, mismatches["missing_codes"], dry_run=False
                )
                print(f"  Added: {added:,} new records (skipped {skipped})")
                if TS_DB_PATH.exists():
                    print(f"  Updating TypeScript DB at {TS_DB_PATH}...")
                    added2, skipped2 = sync_database(
                        TS_DB_PATH, razorpay_records, mismatches["missing_codes"], dry_run=False
                    )
                    print(f"  Added: {added2:,} new records to TypeScript DB (skipped {skipped2})")
        else:
            print("\n[6] Skipping DB sync (use --sync to update)")
