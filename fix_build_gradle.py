#!/usr/bin/env python3
"""Fix build.gradle to add release signing config."""

with open('android/app/build.gradle', 'r', encoding='utf-8') as f:
    content = f.read()

# Add release signing config
old_signing = """    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }"""

new_signing = """    signingConfigs {
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

if old_signing in content:
    content = content.replace(old_signing, new_signing)
    # Update release buildType
    content = content.replace(
        "release {\n            // Caution! In production, you need to generate your own keystore file.\n            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.debug",
        "release {\n            signingConfig signingConfigs.release"
    )
    
    with open('android/app/build.gradle', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ Fixed build.gradle")
else:
    print("⚠️  Signing config section not found or already updated")

