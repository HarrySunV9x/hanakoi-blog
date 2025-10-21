# Android 源码获取（清华源）

curl https://mirrors.tuna.tsinghua.edu.cn/git/git-repo -o repo

chmod a+x repo

export REPO_URL='https://mirrors.tuna.tsinghua.edu.cn/git/git-repo/'

./repo init -u https://aosp.tuna.tsinghua.edu.cn/platform/manifest -b android16-release
repo sync