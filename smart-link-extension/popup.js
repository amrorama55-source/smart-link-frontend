document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const tabShorten = document.getElementById('tabShorten');
  const tabBio = document.getElementById('tabBio');
  const tabStats = document.getElementById('tabStats');

  const viewShorten = document.getElementById('viewShorten');
  const viewBio = document.getElementById('viewBio');
  const viewStats = document.getElementById('viewStats');
  const settingsView = document.getElementById('settingsView');

  const currentUrlPreview = document.getElementById('currentUrlPreview');
  const shortenBtn = document.getElementById('shortenBtn');
  const resultContainer = document.getElementById('resultContainer');
  const shortUrlInput = document.getElementById('shortUrlInput');
  const copyBtn = document.getElementById('copyBtn');
  const qrImg = document.getElementById('qrImg');
  const downloadQrBtn = document.getElementById('downloadQrBtn');
  const toast = document.getElementById('toast');

  const enablePasswordToggle = document.getElementById('enablePasswordToggle');
  const passwordInputContainer = document.getElementById('passwordInputContainer');
  const linkPasswordInput = document.getElementById('linkPasswordInput');

  const bioTitleInput = document.getElementById('bioTitleInput');
  const addToBioBtn = document.getElementById('addToBioBtn');

  const recentLinksList = document.getElementById('recentLinksList');
  const refreshStatsBtn = document.getElementById('refreshStatsBtn');

  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const serverUrlInput = document.getElementById('serverUrlInput');
  const apiKeyInput = document.getElementById('apiKeyInput');

  let currentTabUrl = '';
  let currentTabTitle = '';

  let activeTabName = 'shorten';

  // 1. Settings Init
  chrome.storage.local.get(['serverUrl', 'apiKey', 'recentLinks'], (res) => {
    if (res.serverUrl) serverUrlInput.value = res.serverUrl;
    if (res.apiKey) apiKeyInput.value = res.apiKey;
    if (res.recentLinks) renderStatsList(res.recentLinks);
  });

  // 2. Query Active Tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      currentTabUrl = tab.url;
      currentTabTitle = tab.title || 'My Link';
      currentUrlPreview.textContent = currentTabUrl;
      bioTitleInput.value = currentTabTitle;
    } else {
      currentUrlPreview.textContent = 'Unable to detect page URL';
    }
  } catch (err) {
    currentUrlPreview.textContent = 'Error detecting URL';
  }

  // 3. Tab Navigation
  tabShorten.addEventListener('click', () => switchTab('shorten'));
  tabBio.addEventListener('click', () => switchTab('bio'));
  tabStats.addEventListener('click', () => {
    switchTab('stats');
    loadRecentStats();
  });

  function switchTab(tabName) {
    activeTabName = tabName;
    [tabShorten, tabBio, tabStats].forEach(t => t.classList.remove('active'));
    [viewShorten, viewBio, viewStats].forEach(v => {
      v.classList.remove('active');
      v.style.display = ''; // Reset inline style so CSS classes take control
    });
    settingsView.style.display = 'none'; // Ensure settings is closed

    if (tabName === 'shorten') {
      tabShorten.classList.add('active');
      viewShorten.classList.add('active');
    } else if (tabName === 'bio') {
      tabBio.classList.add('active');
      viewBio.classList.add('active');
    } else if (tabName === 'stats') {
      tabStats.classList.add('active');
      viewStats.classList.add('active');
    }
  }

  // Password Toggle Handler
  enablePasswordToggle.addEventListener('change', (e) => {
    passwordInputContainer.style.display = e.target.checked ? 'block' : 'none';
  });

  // 4. Shorten & Create QR
  shortenBtn.addEventListener('click', async () => {
    if (!currentTabUrl || (!currentTabUrl.startsWith('http://') && !currentTabUrl.startsWith('https://'))) {
      alert('⚠️ Please open a regular web page (like google.com or youtube.com) to shorten its link!');
      shortenBtn.disabled = false;
      shortenBtn.textContent = '⚡ Shorten & Create QR';
      return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Processing...';

    let serverUrl = serverUrlInput.value.trim();
    if (!serverUrl || !serverUrl.startsWith('http')) {
      serverUrl = 'https://api.by-smartlink.com';
      serverUrlInput.value = serverUrl;
    }
    const apiKey = apiKeyInput.value.trim();
    const password = enablePasswordToggle.checked ? linkPasswordInput.value.trim() : null;

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-API-Key'] = apiKey;

      const bodyData = { originalUrl: currentTabUrl };
      if (password) bodyData.password = password;

      // Always use /api/public/shorten - it supports both anonymous and API key authenticated requests.
      // The /api/links endpoint requires a JWT session cookie which the extension doesn't have.
      const endpoint = `${serverUrl}/api/public/shorten`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      // Support both response shapes: { shortUrl } or { link: { shortUrl } }
      const shortUrl = data.shortUrl || data.link?.shortUrl;

      if (response.ok && shortUrl) {
        shortUrlInput.value = shortUrl;

        // Generate QR code URL
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`;
        qrImg.src = qrUrl;

        resultContainer.style.display = 'block';

        // Auto copy to clipboard
        navigator.clipboard.writeText(shortUrl);
        showToast('Short URL copied to clipboard!');

        // Save to recent links local storage
        saveToRecentLinks({
          shortUrl,
          originalUrl: currentTabUrl,
          clicks: 0,
          date: new Date().toLocaleDateString()
        });
      } else if (response.status === 401) {
        // Fallback to anonymous shortening if API key is invalid
        const anonymousResponse = await fetch(`${serverUrl}/api/public/shorten`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl: currentTabUrl })
        });
        
        const anonData = await anonymousResponse.json();
        const shortUrl = anonData.shortUrl || anonData.link?.shortUrl || anonData.url;
        
        if (anonymousResponse.ok && shortUrl) {
          qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`;
          shortUrlInput.value = shortUrl;
          resultContainer.style.display = 'block';
          
          navigator.clipboard.writeText(shortUrl);
          
          saveToRecentLinks({
            shortUrl,
            originalUrl: currentTabUrl,
            clicks: 0,
            date: new Date().toLocaleDateString()
          });
          
          showToast('Shortened anonymously (Invalid API Key)');
        } else {
          alert(anonData.message || anonData.error || 'Failed to create short link anonymously.');
        }
      } else {
        alert(data.message || data.error || 'Failed to create short link.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error connecting to Smart Link server.');
    } finally {
      shortenBtn.disabled = false;
      shortenBtn.textContent = '⚡ Shorten & Create QR';
    }
  });

  // 5. Add to Bio Page
  addToBioBtn.addEventListener('click', async () => {
    const title = bioTitleInput.value.trim() || currentTabTitle;
    let serverUrl = serverUrlInput.value.trim();
    if (!serverUrl || !serverUrl.startsWith('http')) {
      serverUrl = 'https://api.by-smartlink.com';
      serverUrlInput.value = serverUrl;
    }
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      alert('🔑 Please enter your Smart Link API Key in Settings ⚙️ to add links to your Bio Page!');
      settingsView.style.display = 'block';
      [viewShorten, viewBio, viewStats].forEach(v => v.style.display = 'none');
      return;
    }

    addToBioBtn.disabled = true;
    addToBioBtn.textContent = 'Adding to Bio...';

    try {
      const headers = { 
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      };

      // Step 1: Fetch current bio settings to get existing customLinks
      const getResponse = await fetch(`${serverUrl}/api/bio/settings`, {
        method: 'GET',
        headers
      });

      if (getResponse.status === 401) {
        alert('🔑 Invalid API Key. Please update your API Key in Settings ⚙️!');
        settingsView.style.display = 'block';
        [viewShorten, viewBio, viewStats].forEach(v => v.style.display = 'none');
        return;
      }

      if (!getResponse.ok) {
        throw new Error('Failed to fetch bio settings');
      }

      const getData = await getResponse.json();
      const customLinks = getData.bioPage?.customLinks || [];

      // Step 2: Append new link
      customLinks.push({
        title: title,
        url: currentTabUrl,
        clicks: 0,
        isActive: true
      });

      // Step 3: Save updated bio settings
      const putResponse = await fetch(`${serverUrl}/api/bio/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ customLinks })
      });

      const putData = await putResponse.json();

      if (putResponse.ok) {
        showToast('Successfully added to your Bio Page! 🎉');
        bioTitleInput.value = ''; // clear input
      } else {
        alert(putData.error || putData.message || 'Failed to update Bio settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server. Please try again.');
    } finally {
      addToBioBtn.disabled = false;
      addToBioBtn.textContent = '➕ Add to My Bio Page';
    }
  });

  // 6. Recent Links Local Storage
  function saveToRecentLinks(newItem) {
    chrome.storage.local.get(['recentLinks'], (res) => {
      let list = res.recentLinks || [];
      list = [newItem, ...list.filter(item => item.shortUrl !== newItem.shortUrl)].slice(0, 10);
      chrome.storage.local.set({ recentLinks: list });
    });
  }

  async function loadRecentStats() {
    refreshStatsBtn.textContent = '⏳';
    chrome.storage.local.get(['recentLinks', 'serverUrl'], async (res) => {
      let list = res.recentLinks || [];
      const serverUrl = res.serverUrl || 'https://api.by-smartlink.com';
      
      if (list.length === 0) {
        renderStatsList(list);
        refreshStatsBtn.textContent = '🔄';
        return;
      }
      
      // Fetch latest stats for each link
      try {
        const updatedList = await Promise.all(list.map(async (item) => {
          try {
            const shortCodeMatch = item.shortUrl.match(/\/([a-zA-Z0-9_-]+)$/);
            if (shortCodeMatch && shortCodeMatch[1]) {
              const shortCode = shortCodeMatch[1];
              const statRes = await fetch(`${serverUrl}/api/public/stats/${shortCode}`);
              if (statRes.ok) {
                const statData = await statRes.json();
                item.clicks = statData.totalClicks || 0;
              }
            }
          } catch (e) {
            console.error('Failed to fetch stats for', item.shortUrl, e);
          }
          return item;
        }));
        
        chrome.storage.local.set({ recentLinks: updatedList });
        renderStatsList(updatedList);
      } catch (err) {
        console.error('Error updating stats', err);
        renderStatsList(list); // fallback to cached
      }
      
      refreshStatsBtn.textContent = '🔄';
    });
  }

  refreshStatsBtn.addEventListener('click', () => loadRecentStats());

  function renderStatsList(list) {
    if (!list || list.length === 0) {
      recentLinksList.innerHTML = '<div class="empty-state">No recent links found. Shorten a URL to start tracking!</div>';
      return;
    }

    recentLinksList.innerHTML = list.map(item => `
      <div class="link-item">
        <div class="link-info">
          <div class="link-short">${item.shortUrl}</div>
          <div class="link-original">${item.originalUrl}</div>
        </div>
        <span class="badge-clicks">${item.clicks || 0} clicks</span>
      </div>
    `).join('');
  }

  // 7. Clipboard & QR Handlers
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(shortUrlInput.value);
    showToast('Copied to clipboard!');
  });

  downloadQrBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = qrImg.src;
    a.download = 'smartlink-qr.png';
    a.target = '_blank';
    a.click();
  });

  // 8. Settings Navigation
  openSettingsBtn.addEventListener('click', () => {
    [viewShorten, viewBio, viewStats].forEach(v => v.style.display = 'none');
    settingsView.style.display = 'block';
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsView.style.display = 'none';
    switchTab(activeTabName);
  });

  saveSettingsBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    let serverUrl = serverUrlInput.value.trim();
    if (!serverUrl || !serverUrl.startsWith('http')) {
      serverUrl = 'https://api.by-smartlink.com';
      serverUrlInput.value = serverUrl;
    }

    chrome.storage.local.set({ apiKey, serverUrl }, () => {
      showToast('Settings saved!');
      settingsView.style.display = 'none';
      switchTab(activeTabName);
    });
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }
});
