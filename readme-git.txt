git init
git add -A
git commit -m "Initial commit"

git init
git rm . -r --cached
git add .
git commit -m "first commit"
git remote add origin https://github.com/prasadmarineni/finance-32.git
git push -u origin master