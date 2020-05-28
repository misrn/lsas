from app import app
import smtplib
from email.mime.text import MIMEText
from email.header import Header

def send_mail(to_list,subject,content):
    msg = MIMEText(content,'html',_charset='utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = app.config["EMAIL_USER"]
    msg['to'] = to_list
    try:
        s = smtplib.SMTP_SSL()
        s.connect(app.config["EMAIL_HOST"],app.config["EMAIL_PROT"])
        s.login(app.config["EMAIL_USER"],app.config["EMAIL_PASSWD"])
        s.sendmail(app.config["EMAIL_USER"],to_list,msg.as_string())
        s.close()
        return True
    except Exception as e:
        print(str(e))
        return False