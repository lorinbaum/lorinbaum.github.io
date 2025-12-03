import os, paramiko, getpass, stat
from pathlib import Path

HOST = "lorinbaumgarten.com"
LOCALDIR = str(Path(__file__).parent / "home")
REMOTEDIR = "public"

def rmentries(sftp:paramiko.SFTPClient, path):
    for entry in sftp.listdir(path):
        print("\033[2KSFTP remove:", entry, end="\r")
        if stat.S_ISDIR(sftp.stat(entrypath:=path + "/" + entry).st_mode):
            rmentries(sftp, entrypath)
            sftp.rmdir(entrypath)
        else: sftp.remove(entrypath)

def putdir(sftp:paramiko.SFTPClient, localdir:str, remotedir:str):
    try: sftp.stat(remotedir)
    except FileNotFoundError: sftp.mkdir(remotedir)
    # Walk local directory
    for root, dirs, files in os.walk(localdir):
        # Compute relative path and corresponding remote path
        rel_path = os.path.relpath(root, localdir)
        remote_root = remotedir if rel_path == "." else os.path.join(remotedir, rel_path)
        # Ensure each subdirectory exists remotely
        for d in dirs:
            remote_subdir = os.path.join(remote_root, d)
            try: sftp.stat(remote_subdir)
            except FileNotFoundError: sftp.mkdir(remote_subdir)
        # Upload all files in this directory
        for f in files:
            local_file = os.path.join(root, f)
            remote_file = os.path.join(remote_root, f)
            print("\033[2KSFTP put:", os.path.relpath(local_file, localdir), end="\r")
            sftp.put(local_file, remote_file)

if __name__ == "__main__":
    USERNAME = input("Username for lorinbaumgarten.com: ")
    PASSWORD = getpass.getpass(f"{USERNAME}@lorinbaumgarten.com's password: ")
    transport = paramiko.Transport((HOST, 22))
    transport.connect(username=USERNAME, password=PASSWORD)
    sftp = paramiko.SFTPClient.from_transport(transport)

    rmentries(sftp, REMOTEDIR)
    assert len(entries:=sftp.listdir(REMOTEDIR)) == 0, entries

    putdir(sftp, LOCALDIR, REMOTEDIR)
    print("\033[2K", end="\r")

    sftp.close()
    transport.close()