# Vercel Deployment Guide

## 🚀 Deployment Steps

### 1. Environment Variables Setup

Add these environment variables in your Vercel project settings:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stream Video API
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

# Base URL (will be auto-set by Vercel)
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

### 2. Vercel Deployment

1. **Connect to GitHub:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `lets-talk-app`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables:**
   - Add all environment variables listed above
   - Make sure to use production keys

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### 3. Post-Deployment

1. **Update Base URL:**
   - After deployment, update `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL

2. **Test Features:**
   - Test authentication
   - Test video calls
   - Test responsive design

## 🔧 Build Configuration

The project is configured with:
- ✅ Next.js 15.2.1
- ✅ TypeScript support
- ✅ Tailwind CSS
- ✅ Optimized for production
- ✅ Security headers
- ✅ Image optimization

## 📱 Features Ready for Production

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Video conferencing with Stream
- ✅ Authentication with Clerk
- ✅ Hamburger menu for mobile
- ✅ Meeting room controls
- ✅ Multi-participant support

## 🛠️ Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check Node.js version (18+ recommended)
- Verify all dependencies are installed

### Runtime Errors
- Check environment variables in Vercel dashboard
- Verify API keys are correct
- Check browser console for errors

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Clerk Documentation](https://clerk.com/docs)
- [Stream Video Documentation](https://getstream.io/video/docs/)
