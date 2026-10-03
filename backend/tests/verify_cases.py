import urllib.request
import json
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

test_cases = [
    {
        "name": "1. Bank / KYC Scam",
        "message": "Dear SBI Customer, your account is temporarily blocked due to pending KYC verification. Update your PAN and Aadhaar details immediately using the provided link to avoid suspension."
    },
    {
        "name": "2. Fake Internship Scam",
        "message": "Congratulations! You have been selected for an internship. Pay a registration fee to confirm your position."
    },
    {
        "name": "3. OTP Extraction Scam",
        "message": "Your account will be suspended. Share your OTP immediately to reactivate it."
    },
    {
        "name": "4. Benign / Normal Message",
        "message": "Hi, our project meeting is scheduled for 3 PM tomorrow. Please bring your notes."
    },
    {
        "name": "5. Tamil Urgent Payment Scam",
        "message": "உடனடியாக ரூ. 999 கட்டணம் செலுத்தவும். வேலை உறுதி செய்யப்படும்."
    }
]

print("Executing Live API Verification against http://127.0.0.1:5000/api/analyze/message...\n")

for test in test_cases:
    payload = json.dumps({"message": test["message"], "is_demo": False}).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:5000/api/analyze/message",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"=== {test['name']} ===")
            print(f"Input:       {test['message']}")
            print(f"Risk Score:  {data.get('risk_score')}/100")
            print(f"Risk Level:  {data.get('risk_level')}")
            print(f"Confidence:  {data.get('confidence')}")
            print(f"Engine:      {data.get('engine')}")
            print(f"Signals ({len(data.get('warning_signals', []))}):")
            for sig in data.get('warning_signals', []):
                print(f"  - [{sig.get('signal_id')}] (Severity: {sig.get('severity')}, Contribution: +{sig.get('score_contribution')}): {sig.get('title')}")
                if sig.get('evidence'):
                    print(f"    Evidence: \"{sig.get('evidence')}\"")
            print("Risk Story:")
            story = data.get('risk_story', {})
            print(f"  Trigger:   {story.get('trigger')}")
            print(f"  Pressure:  {story.get('pressure')}")
            print(f"  Request:   {story.get('request')}")
            print(f"  Risk:      {story.get('potential_risk')}")
            print(f"Explanation: {data.get('explanation')}")
            print()
    except Exception as e:
        print(f"FAILED {test['name']}: {e}\n")
