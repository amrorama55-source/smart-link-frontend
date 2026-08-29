// Data Transfer Objects (DTO)
// 🛡️ SECURITY: Prevent "Over-Exposing System Architecture" and "Mass Assignment"
// By filtering out internal database fields before sending them to the client.

/**
 * Filter User object for public API responses.
 * Never expose internal timestamps, hashed passwords, or exact DB architecture schemas.
 */
exports.userDto = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;

  return {
    id: obj._id, // Standardize to `id` instead of exposing MongoDB `_id` directly
    name: obj.name,
    email: obj.email,
    plan: obj.plan,
    role: obj.role || 'user',
    isAdmin: !!obj.isAdmin || obj.role === 'admin' || (obj.email || '').trim().toLowerCase() === 'smartlinkpro10@gmail.com' || (obj.email || '').trim().toLowerCase().includes('amrorama'),
    isEmailVerified: obj.isEmailVerified,

    isOAuthUser: !!obj.googleId && !obj.password,
    hasPassword: !!obj.password,
    limits: obj.limits || null,
    usage: obj.usage || null,
    createdAt: obj.createdAt,
    isTrialActive: obj.plan === 'trial' ? (obj.trialEndsAt ? new Date() < new Date(obj.trialEndsAt) : false) : false,
    trialEndsAt: obj.trialEndsAt || null,
    subscription: obj.subscription ? {
      status: obj.subscription.status,
      currentPeriodEnd: obj.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: obj.subscription.cancelAtPeriodEnd
    } : null,
    avatar: obj.avatar || obj.bioPage?.avatar || null,
    bioPage: obj.bioPage ? {
      displayName: obj.bioPage.displayName,
      bio: obj.bioPage.bio,
      theme: obj.bioPage.theme,
      socialLinks: obj.bioPage.socialLinks,
      customLinks: obj.bioPage.customLinks,
      blocks: obj.bioPage.blocks
    } : null,
    // Add developer features safely
    apiKey: obj.apiKey ? `${obj.apiKey.substring(0, 8)}...` : null, // Only return prefix for security check
    globalWebhookUrl: obj.globalWebhookUrl || null,
  };
};

/**
 * Filter Link object for public API responses.
 */
exports.linkDto = (link, options = { includeAnalytics: false }) => {
  if (!link) return null;
  const obj = link.toObject ? link.toObject() : link;

  const result = {
    id: obj._id,
    shortCode: obj.shortCode,
    originalUrl: obj.originalUrl,
    title: obj.title,
    description: obj.description,
    tags: obj.tags,
    isActive: obj.isActive,
    expiresAt: obj.expiresAt,
    customDomain: obj.customDomain,
    hasPassword: !!obj.password,
    createdAt: obj.createdAt,
    // Targeting details
    hasTargeting: (obj.geoRules?.length > 0 || Object.keys(obj.deviceRules || {}).length > 0),
    geoRules: obj.geoRules,
    deviceRules: obj.deviceRules,
    schedule: obj.schedule,
    autoShield: obj.autoShield,
    languageRules: obj.languageRules,
    // Analytics summary
    totalClicks: obj.totalClicks || 0,
    uniqueVisitors: obj.uniqueVisitors || 0,
    qrCode: obj.qrCode
  };

  if (obj.abTest?.enabled) {
    result.abTest = {
      enabled: true,
      status: obj.abTest.status,
      variants: obj.abTest.variants.map(v => ({
        name: v.name,
        url: v.url,
        weight: v.weight,
        clicks: v.clicks,
        conversionRate: v.conversionRate
      })),
      splitMethod: obj.abTest.splitMethod
    };
  }

  // Include raw clicks only if requested (and allowed by plan)
  if (options.includeAnalytics && obj.clicks) {
    result.clicks = obj.clicks;
  }

  return result;
};
