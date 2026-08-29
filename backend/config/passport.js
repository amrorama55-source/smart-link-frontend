const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

// دالة مساعدة لإنشاء أو تحديث المستخدم
async function findOrCreateUser({ email, name, provider, providerId, avatar }) {
  if (!email) throw new Error(`${provider} profile email is missing`);

  console.log('================================================');
  console.log('🔍 Looking for user with email:', email);

  // البحث عن المستخدم بالبريد الإلكتروني أو Provider ID
  let user = await User.findOne({
    $or: [
      { email },
      { googleId: providerId }
    ]
  });

  if (user) {
    console.log('✅ Existing user found:', user._id);

    // تحديث Google ID إذا لم يكن موجودًا
    let needsSave = false;
    if (provider === 'google' && !user.googleId) {
      console.log('🔄 Adding Google ID to existing user');
      user.googleId = providerId;
      needsSave = true;
    }

    // تحديث الصورة إذا لم تكن موجودة
    if (avatar && !user.avatar) {
      console.log('🔄 Adding Google Avatar to existing user');
      user.avatar = avatar;
      needsSave = true;
    }

    if (needsSave) {
      await user.save();
      console.log('✅ User updated successfully');
    }

    console.log('================================================');
    return user;
  } else {
    console.log('➕ Creating new OAuth user');

    // إنشاء مستخدم جديد بدون password
    user = new User({
      name: name || email.split('@')[0],
      email,
      avatar,
      isEmailVerified: true, // OAuth providers verify email
      plan: 'trial',
      trialStartedAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      apiKey: 'sk_' + crypto.randomBytes(32).toString('hex'),
      // لاحظ: لا password هنا - OAuth users لا يحتاجون password
      ...(provider === 'google' ? { googleId: providerId } : {}),
    });
    user.__allowTrial = true; // Bypass User model guard

    await user.save();
    console.log('✅ New OAuth user created:', user._id);
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 API Key:', user.apiKey ? 'Generated ✅' : 'Missing ❌');

    // التحقق من الحفظ في قاعدة البيانات
    const verifiedUser = await User.findById(user._id);
    if (!verifiedUser) {
      console.error('❌ CRITICAL: User not found after save!');
      throw new Error('Failed to save user to database');
    }

    console.log('✅ User verified in database');
    console.log('================================================');
    return verifiedUser;
  }
}

// ========================================
// CALLBACK URL - Using environment variable for local/prod flexibility
// ========================================
const CALLBACK_URL = (process.env.GOOGLE_CALLBACK_URL || '').trim();
const clientID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();

console.log('================================================');
console.log('🔍 Google OAuth Configuration');
console.log('================================================');
console.log('Callback URL:', CALLBACK_URL);
console.log('Client ID:', clientID ? 'SET ✅' : 'MISSING ❌');
console.log('Client Secret:', clientSecret ? 'SET ✅' : 'MISSING ❌');
console.log('================================================');

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: CALLBACK_URL,
  proxy: true,
  passReqToCallback: false
}, async (accessToken, refreshToken, profile, done) => {

  try {
    console.log('================================================');
    console.log('✅ Google Profile received');
    console.log('📧 Email:', profile.emails?.[0]?.value);
    console.log('👤 Name:', profile.displayName);
    console.log('🆔 Google ID:', profile.id);
    console.log('================================================');

    const email = profile.emails && profile.emails[0]?.value;
    const name = profile.displayName;
    const avatar = profile.photos && profile.photos[0]?.value;

    if (!email) {
      console.error('❌ No email in Google profile');
      return done(new Error('No email provided by Google'), null);
    }

    // إنشاء أو إيجاد المستخدم
    const user = await findOrCreateUser({
      email,
      name,
      provider: 'google',
      providerId: profile.id,
      avatar
    });

    console.log('================================================');
    console.log('✅ User authenticated successfully');
    console.log('🆔 User ID:', user._id);
    console.log('📧 User email:', user.email);
    console.log('👤 User name:', user.name);
    console.log('🔐 Has password:', user.password ? 'Yes' : 'No (OAuth)');
    console.log('🔑 Has Google ID:', user.googleId ? 'Yes ✅' : 'No ❌');
    console.log('✅ Is Email Verified:', user.isEmailVerified ? 'Yes ✅' : 'No ❌');
    console.log('================================================');

    // التحقق النهائي
    if (!user._id) {
      console.error('❌ User has no ID!');
      return done(new Error('User creation failed'), null);
    }

    done(null, user);
  } catch (error) {
    console.error('================================================');
    console.error('❌ Google OAuth Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('================================================');
    done(error, null);
  }
}));

// Serialize
passport.serializeUser((user, done) => {
  console.log('🔄 Serializing user:', user._id);
  done(null, user._id);
});

// Deserialize
passport.deserializeUser(async (id, done) => {
  try {
    console.log('🔄 Deserializing user:', id);
    const user = await User.findById(id);
    if (!user) {
      console.error('❌ User not found during deserialization');
      return done(new Error('User not found'), null);
    }
    console.log('✅ User deserialized:', user.email);
    done(null, user);
  } catch (error) {
    console.error('❌ Deserialization error:', error);
    done(error, null);
  }
});

module.exports = passport;

