# -*- coding: utf-8 -*-
from app.views.common import *

# 定义蓝图
index_url = Blueprint('index', __name__)


@index_url.route('/')
@login_required  # 登录保护
def index():
    return render_template('index/index.html')
