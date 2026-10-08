from PIL import Image
import os

im1 = Image.open(r'C:/Users/ADMIN/.gemini/antigravity/brain/65c60ab9-6810-4d22-be51-eb74f354bf13/.user_uploaded/media_1791469216394.png')
scratch_dir = r'C:/Users/ADMIN/Documents/Workspace/bgcoating.com/calculator-react/scratch'

# Main content is from x: 120 to 800, y: 0 to 531
w, h = im1.size
content1 = im1.crop((120, 0, 520, h))
content1.resize((content1.width * 2, content1.height * 2), Image.Resampling.LANCZOS).save(os.path.join(scratch_dir, 'calc_content_p1.png'))

content1_mid = im1.crop((120, 150, 520, 380))
content1_mid.resize((content1_mid.width * 2, content1_mid.height * 2), Image.Resampling.LANCZOS).save(os.path.join(scratch_dir, 'calc_content_mid.png'))

content1_bot = im1.crop((120, 350, 520, h))
content1_bot.resize((content1_bot.width * 2, content1_bot.height * 2), Image.Resampling.LANCZOS).save(os.path.join(scratch_dir, 'calc_content_bot.png'))

print("Saved calc crops")
