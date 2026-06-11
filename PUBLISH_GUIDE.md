# 📤 Publishing MantleGuard to VS Code Marketplace

## Prerequisites

Before publishing, you need:

1. ✅ Extension packaged (mantleguard-0.1.0.vsix) - DONE!
2. ⏳ Microsoft Account
3. ⏳ Azure DevOps Personal Access Token
4. ⏳ Publisher account on VS Code Marketplace

---

## Step 1: Create Publisher Account

1. Go to: https://marketplace.visualstudio.com/manage
2. Sign in with your Microsoft account
3. Click "Create Publisher"
4. Fill in:
   - **Publisher Name:** mantleguard (or your choice)
   - **Display Name:** MantleGuard Team
   - **Description:** Smart contract security tools
5. Save

---

## Step 2: Create Personal Access Token (PAT)

1. Go to: https://dev.azure.com
2. Click your profile icon → **Personal Access Tokens**
3. Click "New Token"
4. Settings:
   - **Name:** MantleGuard Extension Publishing
   - **Organization:** All accessible organizations
   - **Expiration:** Custom (1 year recommended)
   - **Scopes:** Custom → **Marketplace (Manage)**
5. Click "Create"
6. **COPY THE TOKEN** (you won't see it again!)

---

## Step 3: Prepare Extension for Publishing

### Add Required Files:

#### 1. Create LICENSE file
```bash
cd "C:\Users\etven\OneDrive\Desktop\mantleguard extenstion\regvault-ai\extension"
```

Create `LICENSE` file with MIT license:
```
MIT License

Copyright (c) 2026 MantleGuard Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

#### 2. Add Icon (128x128 PNG)
- Create a 128x128 PNG icon
- Save as `media/icon.png`
- Update package.json to include: `"icon": "media/icon.png"`

#### 3. Update README.md
Make sure README.md has:
- Clear description
- Installation instructions
- Usage examples
- Screenshots (optional but recommended)

---

## Step 4: Login with vsce

```bash
cd "C:\Users\etven\OneDrive\Desktop\mantleguard extenstion\regvault-ai\extension"

# Login with your publisher name
vsce login YOUR_PUBLISHER_NAME

# Enter your Personal Access Token when prompted
```

---

## Step 5: Publish Extension

### Option 1: Publish with vsce
```bash
vsce publish
```

### Option 2: Publish specific version
```bash
vsce publish 0.1.0
```

### Option 3: Publish major/minor/patch
```bash
vsce publish patch    # 0.1.0 → 0.1.1
vsce publish minor    # 0.1.0 → 0.2.0
vsce publish major    # 0.1.0 → 1.0.0
```

---

## Step 6: Verify Publication

1. Go to: https://marketplace.visualstudio.com/manage/publishers/YOUR_PUBLISHER_NAME
2. You should see your extension listed
3. Wait 5-10 minutes for it to appear in VS Code Marketplace
4. Search for "MantleGuard" in VS Code Extensions

---

## Quick Publish Checklist

Before publishing, ensure:

- [ ] LICENSE file created
- [ ] Icon added (128x128 PNG)
- [ ] README.md is complete
- [ ] package.json has correct publisher name
- [ ] package.json has repository URL
- [ ] Version number is correct
- [ ] Extension tested locally
- [ ] No sensitive data in code
- [ ] All dependencies are production-ready

---

## Update Existing Extension

To update after initial publish:

1. Update version in package.json
2. Make your changes
3. Run: `npm run compile`
4. Run: `vsce publish`

---

## Troubleshooting

### Error: "Publisher not found"
- Make sure you created publisher at marketplace.visualstudio.com
- Use exact publisher name when logging in

### Error: "Invalid Personal Access Token"
- Token must have "Marketplace (Manage)" scope
- Token must not be expired
- Try creating a new token

### Error: "Extension already exists"
- You can only publish if you own the publisher account
- Choose a different extension name or publisher

---

## Alternative: Manual Upload

If vsce publish doesn't work:

1. Go to: https://marketplace.visualstudio.com/manage/publishers/YOUR_PUBLISHER_NAME
2. Click "New Extension" → "Visual Studio Code"
3. Drag and drop your `mantleguard-0.1.0.vsix` file
4. Fill in details and submit

---

## After Publishing

Once published, your extension will be available at:
- Marketplace: https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_NAME.mantleguard
- In VS Code: Search "MantleGuard" in Extensions

Users can install with:
```bash
code --install-extension YOUR_PUBLISHER_NAME.mantleguard
```

---

## Important Notes

1. **Testing First:** Always test locally before publishing
2. **Version Numbers:** Follow semantic versioning (major.minor.patch)
3. **Updates:** You can update anytime with `vsce publish`
4. **Unpublish:** Use `vsce unpublish` (but avoid, it affects users)
5. **Stats:** View download stats in marketplace.visualstudio.com/manage

---

## For Now: Install Locally

You don't need to publish to use the extension. Just install locally:

```bash
code --install-extension "C:\Users\etven\OneDrive\Desktop\mantleguard extenstion\regvault-ai\extension\mantleguard-0.1.0.vsix"
```

---

**Publishing is optional!** Install locally first and test thoroughly before publishing. 🚀
