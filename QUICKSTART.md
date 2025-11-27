# Quick Start Checklist ✅

**Updated for the new architecture: Custom Vercel Web App + n8n Workflow**

Use this checklist to track your progress building the Berlin Club Bouncer agent.

## Phase 1: Account Setup (20 minutes)

- [ ] Create n8n account
  - [ ] Choose: n8n Cloud OR Self-hosted
  - [ ] Verify email and log in
  - [ ] Note your instance URL
  
- [ ] Create Vercel account
  - [ ] Sign up at vercel.com (free)
  - [ ] Connect your GitHub account
  
- [ ] Get OpenAI API access
  - [ ] Sign up at platform.openai.com
  - [ ] Generate API key
  - [ ] Add billing method
  - [ ] Add $5-10 credits

## Phase 2: Deploy Web App (30 minutes)

- [ ] Push code to GitHub
  - [ ] Initialize git in `bouncer-app` directory
  - [ ] Create GitHub repository
  - [ ] Push code to GitHub
  
- [ ] Deploy to Vercel
  - [ ] Import GitHub repository
  - [ ] Set root directory to `bouncer-app`
  - [ ] Add environment variable (placeholder for now)
  - [ ] Deploy and get your URL

## Phase 3: Choose Your Brain 🧠
 
 ### Option A: n8n Workflow (Contest Mode)
 *Recommended for the Agent Roast Show submission*
 
 - [ ] Create new workflow in n8n
 - [ ] Add Webhook Trigger node (not Typeform!)
 - [ ] Add Code node (Parse Input)
 - [ ] Add OpenAI credentials to n8n
 - [ ] Add OpenAI node (Photo Validation)
 - [ ] Add Code node (Check Validation)
 - [ ] Add Switch node (Route by Club)
 - [ ] Add Berghain Judge node (OpenAI)
 - [ ] Add KitKat Judge node (OpenAI)
 - [ ] Add Sisyphus Judge node (OpenAI)
 - [ ] Add Merge node
 - [ ] Add Code node (Format Response)
 - [ ] Copy Webhook URL
 - [ ] Activate workflow
 
 ### Option B: OpenAI Direct (Fast Mode)
 *Recommended for quick deployment and testing*
 
 - [ ] Get OpenAI API Key
 - [ ] That's it! No workflow needed.


## Phase 4: Connect & Test (30 minutes)

## Phase 4: Connect & Test (30 minutes)

- [ ] Configure Environment Variables in Vercel
  - [ ] **For Option A (n8n):**
    - `NEXT_PUBLIC_WORKFLOW` = `n8n`
    - `N8N_WEBHOOK_URL` = [Your Webhook URL]
  - [ ] **For Option B (OpenAI):**
    - `NEXT_PUBLIC_WORKFLOW` = `openai`
    - `OPENAI_API_KEY` = [Your OpenAI Key]
  - [ ] Redeploy if needed
  
- [ ] Test with solo photo (all black) → Berghain
- [ ] Test with solo photo (colorful) → Sisyphus
- [ ] Test with solo photo (fetish wear) → KitKat
- [ ] Test with group of 2 → Should work
- [ ] Test with group of 3 → Berghain should reject
- [ ] Test with no people in photo → Should reject
- [ ] Test with group but hidden outfits → Should reject

## Phase 5: Refinement (30-60 minutes)

- [ ] Review AI responses for humor quality
- [ ] Adjust prompts if too harsh or too lenient
- [ ] Test edge cases
- [ ] Verify error handling works
- [ ] Test on mobile devices
- [ ] Check loading states and animations

## Phase 6: Submission (15 minutes)

- [ ] Export n8n workflow as JSON
- [ ] Test the exported workflow (re-import to verify)
- [ ] Share Vercel URL for demo
- [ ] Fill out Agent Roast Show submission form
- [ ] Confirm attendance for November 26
- [ ] Prepare demo materials (screenshots, example responses)

---

## Estimated Total Time: 3-4 hours

## Resources Quick Links

- [n8n Cloud](https://n8n.cloud)
- [Vercel](https://vercel.com)
- [OpenAI Platform](https://platform.openai.com)
- [Agent Roast Show Event](https://lu.ma/agent-roast-show)
- [n8n Documentation](https://docs.n8n.io)
- [Next.js Documentation](https://nextjs.org/docs)

## Need Help?

- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **n8n Discord**: Join for real-time help
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

## Pro Tips

💡 **Start simple**: Get the basic flow working before adding complex logic

💡 **Test incrementally**: Test each node as you add it

💡 **Save often**: n8n auto-saves, but export backups periodically

💡 **Use sticky notes**: Add notes to your workflow canvas to document logic

💡 **Check the logs**: Execution logs show exactly what data flows through each node

💡 **Budget for API costs**: Set a spending limit in OpenAI to avoid surprises

---

Good luck! You've got this! 🚀
