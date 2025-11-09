#!/usr/bin/env python3
"""
Generate signed APK for Android app.
This script will:
1. Create a keystore if it doesn't exist
2. Create key.properties file
3. Update build.gradle to use release signing
4. Build the signed APK
"""

import os
import subprocess
import sys

def run_command(cmd, check=True):
    """Run a shell command."""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result

def create_keystore():
    """Create a keystore file if it doesn't exist."""
    keystore_path = "android/app/quran-app-release.keystore"
    
    if os.path.exists(keystore_path):
        print(f"✓ Keystore already exists at {keystore_path}")
        return keystore_path
    
    print("Creating new keystore...")
    print("Note: You will be prompted to enter keystore information.")
    print("For production, use strong passwords and store them securely!")
    
    # Default values (you should change these for production)
    keystore_password = "quranapp123"
    key_alias = "quran-app-key"
    key_password = "quranapp123"
    validity_years = "10000"  # 10000 days (~27 years)
    
    # Find keytool
    keytool_paths = [
        "C:/Program Files/Java/jdk-17/bin/keytool.exe",
        "C:/Program Files/Java/jdk-17/bin/keytool",
        "keytool",
    ]
    
    keytool = None
    for path in keytool_paths:
        if os.path.exists(path) or path == "keytool":
            keytool = path
            break
    
    if not keytool:
        print("Error: keytool not found. Please install Java JDK.")
        sys.exit(1)
    
    # Create keystore using keytool
    cmd = (
        f'"{keytool}" -genkeypair -v -storetype PKCS12 '
        f'-keystore {keystore_path} '
        f'-alias {key_alias} '
        f'-keyalg RSA -keysize 2048 '
        f'-validity {validity_years} '
        f'-storepass {keystore_password} '
        f'-keypass {key_password} '
        f'-dname "CN=Quran App, OU=Development, O=QuranAppExpo, L=Unknown, S=Unknown, C=US"'
    )
    
    result = run_command(cmd, check=False)
    
    if result.returncode == 0:
        print(f"✓ Keystore created successfully at {keystore_path}")
        return keystore_path, keystore_password, key_alias, key_password
    else:
        print("Error creating keystore. Trying interactive mode...")
        # Try interactive mode
        cmd = (
            f'"{keytool}" -genkeypair -v -storetype PKCS12 '
            f'-keystore {keystore_path} '
            f'-alias {key_alias} '
            f'-keyalg RSA -keysize 2048 '
            f'-validity {validity_years}'
        )
        run_command(cmd)
        return keystore_path, keystore_password, key_alias, key_password

def create_key_properties(keystore_path, keystore_password, key_alias, key_password):
    """Create key.properties file."""
    # Convert to relative path from android/app/
    rel_path = os.path.relpath(keystore_path, "android/app")
    
    properties_content = f"""storePassword={keystore_password}
keyPassword={key_password}
keyAlias={key_alias}
storeFile={rel_path}
"""
    
    properties_path = "android/key.properties"
    with open(properties_path, 'w') as f:
        f.write(properties_content)
    
    print(f"✓ Created {properties_path}")
    return properties_path

def update_build_gradle():
    """Update build.gradle to use release signing."""
    build_gradle_path = "android/app/build.gradle"
    
    with open(build_gradle_path, 'r') as f:
        content = f.read()
    
    # Check if signing is already configured
    if "def keystorePropertiesFile" in content:
        print("✓ build.gradle already has signing configuration")
        return
    
    # Find the signingConfigs section
    signing_config = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            }
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }"""
    
    # Replace the signingConfigs section
    import re
    pattern = r'signingConfigs\s*\{[^}]*\}'
    content = re.sub(pattern, signing_config, content, flags=re.DOTALL)
    
    # Update release buildType to use release signing
    content = content.replace(
        "release {\n            // Caution! In production, you need to generate your own keystore file.\n            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.debug",
        "release {\n            signingConfig signingConfigs.release"
    )
    
    with open(build_gradle_path, 'w') as f:
        f.write(content)
    
    print(f"✓ Updated {build_gradle_path}")

def build_signed_apk():
    """Build the signed release APK."""
    print("\n" + "=" * 60)
    print("Building signed release APK...")
    print("=" * 60)
    
    os.chdir("android")
    cmd = "./gradlew assembleRelease"
    result = run_command(cmd, check=False)
    os.chdir("..")
    
    if result.returncode == 0:
        apk_path = "android/app/build/outputs/apk/release/app-release.apk"
        if os.path.exists(apk_path):
            size = os.path.getsize(apk_path) / (1024 * 1024)  # Size in MB
            print(f"\n✅ Signed APK generated successfully!")
            print(f"📦 Location: {apk_path}")
            print(f"📏 Size: {size:.2f} MB")
        else:
            print("⚠️  Build completed but APK not found at expected location")
    else:
        print("❌ Build failed. Check the error messages above.")

def main():
    print("=" * 60)
    print("🔐 Generating Signed APK for Quran App")
    print("=" * 60)
    
    # Step 1: Create keystore
    print("\n1️⃣  Creating/Checking keystore...")
    keystore_info = create_keystore()
    if isinstance(keystore_info, tuple):
        keystore_path, keystore_password, key_alias, key_password = keystore_info
    else:
        # If keystore exists, use default passwords (user should update these)
        keystore_path = keystore_info
        keystore_password = "quranapp123"
        key_alias = "quran-app-key"
        key_password = "quranapp123"
        print("⚠️  Using default passwords. Update key.properties for production!")
    
    # Step 2: Create key.properties
    print("\n2️⃣  Creating key.properties...")
    create_key_properties(keystore_path, keystore_password, key_alias, key_password)
    
    # Step 3: Update build.gradle
    print("\n3️⃣  Updating build.gradle...")
    update_build_gradle()
    
    # Step 4: Build APK
    print("\n4️⃣  Building signed APK...")
    build_signed_apk()
    
    print("\n" + "=" * 60)
    print("✅ Process complete!")
    print("=" * 60)
    print("\n⚠️  IMPORTANT SECURITY NOTES:")
    print("  - Keep your keystore file and passwords secure!")
    print("  - Never commit keystore files or key.properties to version control")
    print("  - For production, use strong, unique passwords")
    print("  - Store keystore backup in a secure location")

if __name__ == '__main__':
    main()

