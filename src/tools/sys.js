// 这是整个项目的工具函数

import axios from "axios";

// api server 状态检查
export async function apiCheck() {
    // TODO
    let url = '';
    await axios.get(url)
        .then(res => {
            return res.status === 200;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

// 登录状态检测
export async function loginCheck() {
    let uid = localStorage.getItem('uid');
    let name = localStorage.getItem('name');

    if (uid === null || name === null) {
        return false;
    }

    let url = '';
    await axios.get(url)
        .then(res => {
            return res.status === 200;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}
