#!/usr/bin/env python3
import re

with open('android/app/build.gradle', 'r', encoding='utf-8') as f:
    content = f.read()

# Add release signing config after debug
content = re.sub(
    r'(signingConfigs \{[^}]*debug \{[^}]*\}[^}]*)\}',
    r'''\1
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
    }''',
    content,
    flags=re.DOTALL
)

# Update release buildType
content = re.sub(
    r'release \{[^}]*signingConfig signingConfigs\.debug',
    r'release {\n            signingConfig signingConfigs.release',
    content,
    flags=re.DOTALL
)

with open('android/app/build.gradle', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed build.gradle")

