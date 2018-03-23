# -*-coding:utf-8-*-

import os
import json
import time
import pwd
import grp
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

S_ISUID = 04000
S_ISGID = 02000
S_ENFMT = S_ISGID
S_ISVTX = 01000
S_IREAD = 00400
S_IWRITE = 00200
S_IEXEC = 00100
S_IRWXU = 00700
S_IRUSR = 00400
S_IWUSR = 00200
S_IXUSR = 00100
S_IRWXG = 00070
S_IRGRP = 00040
S_IWGRP = 00020
S_IXGRP = 00010
S_IRWXO = 00007
S_IROTH = 00004
S_IWOTH = 00002
S_IXOTH = 00001
S_IFDIR  = 0040000
S_IFCHR  = 0020000
S_IFBLK  = 0060000
S_IFREG  = 0100000
S_IFIFO  = 0010000
S_IFLNK  = 0120000
S_IFSOCK = 0140000


UF_NODUMP    = 0x00000001
UF_IMMUTABLE = 0x00000002
UF_APPEND    = 0x00000004
UF_OPAQUE    = 0x00000008
UF_NOUNLINK  = 0x00000010
UF_COMPRESSED = 0x00000020
UF_HIDDEN    = 0x00008000
SF_ARCHIVED  = 0x00010000
SF_IMMUTABLE = 0x00020000
SF_APPEND    = 0x00040000
SF_NOUNLINK  = 0x00100000
SF_SNAPSHOT  = 0x00200000

ST_MODE  = 0
ST_INO   = 1
ST_DEV   = 2
ST_NLINK = 3
ST_UID   = 4
ST_GID   = 5
ST_SIZE  = 6
ST_ATIME = 7
ST_MTIME = 8
ST_CTIME = 9

def S_IMODE(mode):
    return mode & 07777

def S_IFMT(mode):
    return mode & 0170000

def S_ISDIR(mode):
    return S_IFMT(mode) == S_IFDIR

def S_ISCHR(mode):
    return S_IFMT(mode) == S_IFCHR

def S_ISBLK(mode):
    return S_IFMT(mode) == S_IFBLK

def S_ISREG(mode):
    return S_IFMT(mode) == S_IFREG

def S_ISFIFO(mode):
    return S_IFMT(mode) == S_IFIFO

def S_ISLNK(mode):
    return S_IFMT(mode) == S_IFLNK

def S_ISSOCK(mode):
    return S_IFMT(mode) == S_IFSOCK

def b2h(n):
    symbols = ('K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y')
    prefix = {}
    for i, s in enumerate(symbols):
        prefix[s] = 1 << (i+1)*10
    for s in reversed(symbols):
        if n >= prefix[s]:
            value = float(n) / prefix[s]
            return '%.1f%s' % (value, s)
    return "%sB" % n
def ftime(secs):
    return time.strftime('%Y-%m-%d %X', time.localtime(secs))
def getitem(path):
    if not os.path.exists(path) and not os.path.islink(path): return False
    name = os.path.basename(path)
    basepath = os.path.dirname(path)
    stat = os.lstat(path)
    mode = stat.st_mode
    try:
        uname = pwd.getpwuid(stat.st_uid).pw_name
    except:
        uname = ''
    try:
        gname = grp.getgrgid(stat.st_gid).gr_name
    except:
        gname = ''
    item = {
        "name": name, # 文件名称
        "isdir": S_ISDIR(mode),
        "isreg": S_ISREG(mode),
        "islnk": S_ISLNK(mode),
        "perms": oct(stat.st_mode & 0777),
        "uid": stat.st_uid,
        "gid": stat.st_gid,
        "uname": uname,
        "gname": gname,
        "size": b2h(stat.st_size),
        "atime": ftime(stat.st_atime),
        "mtime": ftime(stat.st_mtime),
        "ctime": ftime(stat.st_ctime),
    }
    if item["islnk"]:
        linkfile = os.readlink(path)
        item["linkto"] = linkfile
        if not linkfile.startswith("/"):
            linkfile = os.path.abspath(os.path.join(basepath, linkfile))
        try:
            stat = os.stat(linkfile)
            item["link_isdir"] = S_ISDIR(stat.st_mode)
            item["link_isreg"] = S_ISREG(stat.st_mode)
            item["link_broken"] = False
        except:
            item["link_broken"] = True
    return item

#列出文件
def listdir(path, showdotfiles=False, onlydir=None):
    path = os.path.abspath(path)
    if not os.path.exists(path) or not os.path.isdir(path): return False
    items = sorted(os.listdir(path))
    if not showdotfiles:
        items = [item for item in items if not item.startswith('.')]
    for i, item in enumerate(items):
        items[i] = getitem(os.path.join(path, item))
    rt = []
    for i in xrange(len(items)-1, -1, -1):
        if items[i]["isdir"] \
                or items[i]["islnk"] \
                        and not items[i]["link_broken"] \
                        and items[i]["link_isdir"]:
            rt.insert(0, items.pop(i))
    if not onlydir: rt.extend(items)
    return rt
#修改名称
def rename(oldpath, newname):
    path = os.path.abspath(oldpath)
    if not os.path.exists(oldpath): return False
    try:
        basepath = os.path.dirname(oldpath)
        newpath = os.path.join(basepath, newname)
        os.rename(oldpath, newpath)
        return True
    except:
        return False
#删除
def delete(path):
    path = os.path.abspath(path)
    print path
    if not os.path.exists(path): return False
    if os.path.isdir(path):
        try:
            print "99999999999"
            print path
            os.removedirs(path)
            return True
        except:
            return False
    elif os.path.isfile(path):
        try:
            os.remove(path)
            return True
        except:
            return False
#新增目录
def dadd(path,name):
    path = os.path.abspath(path)
    if not os.path.exists(path) or not os.path.isdir(path): return False
    dpath = os.path.join(path, name)
    if os.path.exists(dpath): return False
    try:
        os.mkdir(dpath)
        return True
    except:
        return False
#新增文件
def fadd(path, name):
    path = os.path.abspath(path)
    if not os.path.exists(path) or not os.path.isdir(path): return False
    fpath = os.path.join(path, name)
    if os.path.exists(fpath): return False
    try:
        with open(fpath, 'w'): pass
        return True
    except:
        return False
#打开文件
def fopen(path):
    if not os.path.exists(path) or os.path.isdir(path): return False
    try:
        with open(path, 'r') as f:
            return f.read()
    except:
        return False

#保存文件
def fsave(path, content, bakup=False):
    if not os.path.exists(path): return False
    try:
        if bakup:
            dirname = os.path.dirname(path)
            filename = '.%s.bak' % os.path.basename(path)
            os.rename(path, os.path.join(dirname, filename))
        with open(path, 'w') as f: f.write(content)
        return True
    except:
        return False
