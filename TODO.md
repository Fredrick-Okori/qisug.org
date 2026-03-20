# Image Optimization for Page Speed - Task Plan

Current Status: Starting implementation

## Steps:
- [x] 1. Update next.config.mjs with enhanced image formats, sizes, caching
- [ ] 2. Identify and prioritize large images for compression (user manual/online tools)
  - Largest: public/team/hedwig_namazzi.avif (764K), public/images/logo_white.png (488K), etc.
- [x] 3. Add Next/Image optimizations (sizes, priority, lazy) to key files
  - components/home/improved.tsx, components/about-content.tsx, components/site-header.tsx, app/page.tsx, etc.
- [x] 4. Optimize CSS background images (e.g., convert dotted-map-2.png to WebP)
  - Added sizes/priority to Next/Image instances in headers and apply page; changed img to Image for better optimization
- [ ] 5. Optional: Install Homebrew + ImageMagick for bulk CLI compression
- [ ] 6. Test with npm run build + Lighthouse audit
- [ ] 7. Backup originals to public/images/backup/

**Notes**: Proceed step-by-step. Compression may need user intervention (Squoosh/TinyPNG).
