import os
import random
import time
from datetime import datetime
import uuid

# GITHUB CLI REQUIRED! (https://cli.github.com/)

if __name__ == "__main__":
    # os.system("gh auth login") # Daha önce giriş yaptıysan buna gerek yok
    
    # --- AYARLAR (Buraları kendi repona göre kontrol et) ---
    remote_name = "origin"    # Genelde "github" değil "origin" olur.
    main_branch = "main"      # Genelde "master" değil "main" olur.
    temp_branch = "co-author-branch"
    # Badge kazanmak istediğin kişinin bilgileri (Email doğru olmalı):
    co_author = "Visage33 <255624937+Visage33@users.noreply.github.com>" 
    
    # Döngü Sayısı
    for i in range(50):
        # Windows için cls, Mac/Linux için clear kullanılır
        os.system("cls" if os.name == 'nt' else "clear") 
        
        id = uuid.uuid4()
        
        # Branch oluştur
        os.system(f"git checkout -b {temp_branch}")
        time.sleep(2)
        
        # Dosya değiştir
        with open("commit.md", "w") as f:
            f.write(f"{id}")
        time.sleep(1) # Hata almamak için süreyi biraz kıstım ama güvenli olsun
        
        # Git işlemleri
        os.system("git add .")
        time.sleep(1)
        
        # Commit (Co-authored-by etiketi ile)
        os.system(f'git commit -m "{id}" -m "Co-authored-by: {co_author}"')
        time.sleep(2)
        
        # Push
        os.system(f"git push {remote_name} {temp_branch}")
        time.sleep(2)
        
        # PR Oluştur (GitHub CLI)
        os.system(f'gh pr create --title "Automated Pair Contribution {i}" --body "for the badge!" --base {main_branch} --head {temp_branch}')
        time.sleep(5) # GitHub'ın işlemesi için bekle
        
        # PR Merge ve Branch Silme
        os.system("gh pr merge --merge --delete-branch")
        time.sleep(5)
        
        # Ana branch'e dön ve güncelle
        os.system(f"git checkout {main_branch}")
        os.system(f"git pull {remote_name} {main_branch}")