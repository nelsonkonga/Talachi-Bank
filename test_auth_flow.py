import requests
import sys

BASE_URL = "http://localhost:8080/api/auth"

def test_register():
    print("Testing Registration...")
    payload = {
        "username": "testuser_verif",
        "email": "test_verif@example.com",
        "password": "password123",
        "roles": ["user"]
    }
    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        if response.status_code == 200:
            print("✅ Registration Successful")
            return true
        elif response.status_code == 400 and "already taken" in response.text:
             print("⚠️  User already exists (Expected if run multiple times)")
             return True
        else:
            print(f"❌ Registration Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    payload = {
        "username": "testuser_verif",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=payload)
        if response.status_code == 200:
            data = response.json()
            token = data.get("accessToken")
            if token:
                print("✅ Login Successful. Token received.")
                return token
            else:
                print("❌ Login Successful but NO TOKEN found.")
                return None
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None

def main():
    if test_register():
        token = test_login()
        if token:
            print("\n✅✅ AUTHENTICATION FLOW VERIFIED ✅✅")
        else:
            sys.exit(1)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
