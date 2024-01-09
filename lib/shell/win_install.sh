#!/bin/bash

# echo "1 argument is: $1"
# echo "2 argument is: $2"
# echo "3 argument is: $3"

for arg in "$@"
do
  case $arg in
    --webpack=*)
    WEBPACK="${arg#*=}"
    shift
    ;;
    --pkgname=*)
    PKGNAME="${arg#*=}"
    shift
    ;;
    --pkgloc=*)
    PKGLOC="${arg#*=}"
    shift
    ;;
    *)
    # unknown option
    ;;
  esac
done

echo "WEBPACK is: $WEBPACK"
echo "PKGNAME is: $PKGNAME"
echo "PKGLOC is: $PKGLOC"
if [ -n "$WEBPACK" ]
then
  echo "开始安装"
  cd /d $WEBPACK
  pnpm install
else
  echo "缺少必要的--webpack参数或值"
fi

if [ -n "$WEBPACK" ] && [ -n "$PKGNAME" ] && [ -n "$PKGLOC" ]
then
  # IFPKGLOC=${PKGLOC:-"-S"}
  pnpm install $PKGNAME $PKGLOC -w
elif [ -n "$WEBPACK" ] && [ -n "$PKGNAME" ]
then
  pnpm install $PKGNAME -S -w
fi