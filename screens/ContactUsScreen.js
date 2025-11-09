import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Alert, KeyboardAvoidingView, Platform, Share } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const ContactUsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      id: 1,
      type: 'Email',
      value: 'info@peerbits.com',
      icon: '📧',
      action: () => Linking.openURL('mailto:info@peerbits.com')
    },
    {
      id: 2,
      type: 'Phone',
      value: '+1 (555) 123-4567',
      icon: '📞',
      action: () => Linking.openURL('tel:+15551234567')
    },
    {
      id: 3,
      type: 'Website',
      value: 'www.peerbits.com',
      icon: '🌐',
      action: () => Linking.openURL('https://www.peerbits.com')
    },
    {
      id: 4,
      type: 'Social Media',
      value: '@QuranApp',
      icon: '📱',
      action: () => Linking.openURL('https://twitter.com/QuranApp')
    }
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create email with pre-filled data
      const emailBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      const emailSubject = `Contact Form: ${subject}`;
      const mailtoUrl = `mailto:info@peerbits.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open default email client
      await Linking.openURL(mailtoUrl);
      
      Alert.alert(
        'Email Client Opened',
        'Your default email client has been opened with your message. Please send the email to complete your inquiry.',
        [{ text: 'OK', onPress: () => {
          setName('');
          setEmail('');
          setSubject('');
          setMessage('');
        }}]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to open email client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuItemPress = (itemId) => {
    switch (itemId) {
      case 'our_apps':
        navigation.navigate('our-apps');
        break;
      case 'visit_website':
        Linking.openURL('https://www.peerbits.com/').catch(err => {
          Alert.alert('Error', 'Could not open website');
        });
        break;
      case 'contact_us':
        // Already on contact us page
        break;
      case 'share_app':
        // Share app functionality
        (async () => {
          try {
            const result = await Share.share({
              message: 'Check out this amazing Quran app! Download it now.',
              url: 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo',
              title: 'Quran App'
            });
            
            if (result.action === Share.sharedAction) {
              // App shared successfully
            }
          } catch (error) {
            Alert.alert('Error', 'Could not share the app');
          }
        })();
        break;
      case 'rate_app':
        // Rate app functionality
        (() => {
          const appStoreUrl = Platform.OS === 'ios' 
            ? 'https://apps.apple.com/app/id123456789'
            : 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo';
          
          Linking.openURL(appStoreUrl).catch(err => {
            Alert.alert('Error', 'Could not open app store');
          });
        })();
        break;
      case 'faqs':
        navigation.navigate('faqs');
        break;
      default:
        break;
    }
  };

  const handleContactPress = (contact) => {
    Alert.alert(
      contact.type,
      `Would you like to ${contact.type === 'Email' ? 'send an email' : contact.type === 'Phone' ? 'make a call' : 'visit the website'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: contact.action }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Contact Us"
        showBackButton={true}
        onBackPress={handleBackPress}
      />
      
      <KeyboardAvoidingView 
        style={styles.scrollContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <ResponsiveText style={styles.title}>
              Get in Touch
            </ResponsiveText>
            
            <ResponsiveText style={styles.description}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </ResponsiveText>

            {/* Contact Information */}
            <View style={styles.contactInfoSection}>
              <ResponsiveText style={styles.sectionTitle}>
                Contact Information
              </ResponsiveText>
              
              {contactInfo.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => handleContactPress(contact)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.contactIcon}>{contact.icon}</Text>
                  <View style={styles.contactDetails}>
                    <ResponsiveText style={styles.contactType}>{contact.type}</ResponsiveText>
                    <ResponsiveText style={styles.contactValue}>{contact.value}</ResponsiveText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Contact Form */}
            <View style={styles.formSection}>
              <ResponsiveText style={styles.sectionTitle}>
                Send us a Message
              </ResponsiveText>
              
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <ResponsiveText style={styles.inputLabel}>Name *</ResponsiveText>
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your full name"
                    placeholderTextColor="#BDC3C7"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ResponsiveText style={styles.inputLabel}>Email *</ResponsiveText>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#BDC3C7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ResponsiveText style={styles.inputLabel}>Subject *</ResponsiveText>
                  <TextInput
                    style={styles.textInput}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="What is this about?"
                    placeholderTextColor="#BDC3C7"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ResponsiveText style={styles.inputLabel}>Message *</ResponsiveText>
                  <TextInput
                    style={[styles.textInput, styles.messageInput]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Tell us how we can help you..."
                    placeholderTextColor="#BDC3C7"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <ResponsiveText style={styles.submitButtonText}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </ResponsiveText>
                </TouchableOpacity>
              </View>
            </View>

            {/* FAQ Section */}
            <View style={styles.faqSection}>
              <ResponsiveText style={styles.sectionTitle}>
                Frequently Asked Questions
              </ResponsiveText>
              
              <View style={styles.faqItem}>
                <ResponsiveText style={styles.faqQuestion}>
                  How do I backup my data?
                </ResponsiveText>
                <ResponsiveText style={styles.faqAnswer}>
                  Go to Settings > Backup & Restore to create a backup of your favorites and bookmarks.
                </ResponsiveText>
              </View>
              
              <View style={styles.faqItem}>
                <ResponsiveText style={styles.faqQuestion}>
                  Can I use the app offline?
                </ResponsiveText>
                <ResponsiveText style={styles.faqAnswer}>
                  Yes! The Quran text and audio are available offline once downloaded.
                </ResponsiveText>
              </View>
              
              <View style={styles.faqItem}>
                <ResponsiveText style={styles.faqQuestion}>
                  How do I report a bug?
                </ResponsiveText>
                <ResponsiveText style={styles.faqAnswer}>
                  Use the contact form above or email us directly at info@peerbits.com
                </ResponsiveText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: getSpacing(20),
  },
  title: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(10),
    textAlign: 'center',
  },
  description: {
    fontSize: getFontSize(16),
    color: '#7F8C8D',
    marginBottom: getSpacing(30),
    textAlign: 'center',
    lineHeight: 24,
  },
  contactInfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    padding: getSpacing(20),
    marginBottom: getSpacing(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(15),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing(12),
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  contactIcon: {
    fontSize: getFontSize(24),
    marginRight: getSpacing(15),
    width: getSpacing(30),
  },
  contactDetails: {
    flex: 1,
  },
  contactType: {
    fontSize: getFontSize(14),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(2),
  },
  contactValue: {
    fontSize: getFontSize(14),
    color: '#7F8C8D',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    padding: getSpacing(20),
    marginBottom: getSpacing(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  form: {
    marginTop: getSpacing(10),
  },
  inputGroup: {
    marginBottom: getSpacing(20),
  },
  inputLabel: {
    fontSize: getFontSize(14),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: getSpacing(8),
    paddingHorizontal: getSpacing(15),
    paddingVertical: getSpacing(12),
    fontSize: getFontSize(16),
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    height: getSpacing(100),
  },
  submitButton: {
    backgroundColor: '#3498DB',
    paddingVertical: getSpacing(15),
    borderRadius: getSpacing(8),
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: 'bold',
  },
  faqSection: {
    backgroundColor: '#E8F4FD',
    borderRadius: getSpacing(12),
    padding: getSpacing(20),
  },
  faqItem: {
    marginBottom: getSpacing(15),
  },
  faqQuestion: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(5),
  },
  faqAnswer: {
    fontSize: getFontSize(14),
    color: '#5D6D7E',
    lineHeight: 20,
  },
});

export default ContactUsScreen;

