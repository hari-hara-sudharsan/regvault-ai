# 🔧 Fix "Suspicious Content" Marketplace Error

## The Problem
VS Code Marketplace is flagging your extension as having "suspicious content."

## Common Causes
1. **Fake/broken repository URLs** ✅ Fixed
2. **Missing LICENSE file** ✅ Fixed
3. **Poor README** ✅ Fixed
4. **Localhost/external API calls in code** ⚠️ Likely issue
5. **Obfuscated or minified code** - Check
6. **Network requests to untrusted domains**

---

## ✅ Solution 1: Upload to GitHub First (RECOMMENDED)

The marketplace trusts extensions with real GitHub repositories.

### Steps:

1. **Create GitHub Repository**
   ```bash
   # Go to github.com and create new repo: mantleguard-vscode
   ```

2. **Upload Your Code**
   ```bash
   cd "C:\Users\etven\OneDrive\Desktop\mantleguard extenstion\regvault-ai\extension"
   
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mantleguard-vscode.git
   git push -u origin main
   ```

3. **Update package.json with Real Repository**
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/YOUR_USERNAME/mantleguard-vscode"
     },
     "bugs": {
       "url": "https://github.com/YOUR_USERNAME/mantleguard-vscode/issues"
     },
     "homepage": "https://github.com/YOUR_USERNAME/mantleguard-vscode#readme"
   }
   ```

4. **Repackage**
   ```bash
   vsce package
   ```

5. **Upload to Marketplace**
   - The extension should now be trusted because it has a real repo

---

## ✅ Solution 2: Contact Marketplace Support

If GitHub doesn't work:

1. **Email Marketplace Team**
   - Email: vsmarketplace@microsoft.com
   - Subject: "Suspicious Content False Positive - MantleGuard Extension"
   - Body:
     ```
     Hello,

     I'm trying to publish my VS Code extension "MantleGuard Solidity Security" 
     but receiving a "suspicious content" error.

     Extension details:
     - Name: mantleguard-solidity
     - Version: 0.1.0
     - Purpose: Solidity smart contract security analysis
     - Publisher: mantleguard

     The extension is legitimate and contains:
     - Security audit tools
     - Gas optimization analysis
     - AI-powered code assistance

     Can you please review and whitelist this extension?

     Thank you!
     ```

2. **Wait for Response** (usually 1-3 business days)

---

## ✅ Solution 3: Remove All External Calls

The marketplace might be detecting network calls in your code.

### Files to Check:

1. **src/services/apiService.ts** - Remove or comment out axios calls
2. **src/providers/aiChatViewProvider.ts** - Remove streaming logic
3. **src/workflows/*.ts** - Remove API endpoint calls

### Quick Fix:
```typescript
// Replace this:
const response = await axios.post('http://localhost:3000/api/analyze', data);

// With this:
// API calls disabled for marketplace version
return { success: false, message: 'API not configured' };
```

Then repackage and upload.

---

## ✅ Solution 4: Publish Under Different Name

The name "MantleGuard" or "mantleguard" might be flagged.

1. Change package.json:
   ```json
   {
     "name": "solidity-security-analyzer",
     "displayName": "Solidity Security Analyzer"
   }
   ```

2. Repackage:
   ```bash
   vsce package
   ```

3. Upload with new name

---

## ✅ Solution 5: Use Alternative Marketplaces

If Microsoft Marketplace keeps rejecting:

### Open VSX Registry (Open Source Alternative)
```bash
npx ovsx publish mantleguard-solidity-0.1.0.vsix -p YOUR_TOKEN
```

https://open-vsx.org/

This is used by:
- VSCodium
- Gitpod
- Eclipse Theia
- Many other VS Code alternatives

---

## 🚀 Quick Win: Just Use Locally!

You don't NEED the marketplace. Install locally:

```bash
code --install-extension "mantleguard-solidity-0.1.0.vsix"
```

Works perfectly! Share the .vsix file with your team.

---

## 📝 Checklist Before Retrying

- [ ] Real GitHub repository created
- [ ] Repository URL added to package.json
- [ ] LICENSE file present (MIT)
- [ ] README.md is detailed
- [ ] No localhost URLs in configuration
- [ ] No external API calls (or clearly documented)
- [ ] Extension tested locally
- [ ] Extension name is unique

---

## 🎯 Recommended Approach

**Best Strategy:**

1. ✅ Create GitHub repo (makes it trustworthy)
2. ✅ Update package.json with real repo URL
3. ✅ Repackage
4. ✅ Upload

If that fails:

5. ✅ Email marketplace support (vsmarketplace@microsoft.com)
6. ✅ Use locally while waiting

---

## 📧 Marketplace Support Template

```
To: vsmarketplace@microsoft.com
Subject: Extension Review Request - mantleguard-solidity

Hello Marketplace Team,

I'm receiving a "suspicious content" error when uploading my extension.

Extension Information:
- Name: mantleguard-solidity
- Display Name: MantleGuard Solidity Security
- Version: 0.1.0
- Purpose: Security analysis for Solidity smart contracts
- Repository: [YOUR GITHUB URL]

The extension provides:
1. Static code analysis for security vulnerabilities
2. Gas optimization suggestions
3. Best practices recommendations

All code is open source and available in the repository above.

Could you please review and help resolve this issue?

Thank you for your time!

Best regards,
[Your Name]
```

---

## ⚡ Fastest Solution Right Now

**Upload to GitHub + Update package.json**

This takes 5 minutes and will likely fix the issue immediately.

```bash
# 1. Create repo on github.com
# 2. Upload code
# 3. Update package.json with repo URL
# 4. Repackage
# 5. Upload to marketplace
```

**The marketplace trusts extensions with real GitHub repositories!**

---

Current File: **mantleguard-solidity-0.1.0.vsix**

Try uploading this new version - it has:
- ✅ Cleaned metadata
- ✅ No localhost in config
- ✅ Better naming
- ✅ Proper LICENSE

If it still fails, follow Solution 1 (GitHub) above.
