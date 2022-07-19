import React, { useState, useEffect } from "react";
import { Descriptions, Avatar, message } from "antd";
import { useHistory } from 'react-router-dom'
import actions from '@/shared/actions';

const Status = () => {
  const [userInfo, setUserInfo] = useState();
  const history = useHistory()
  const getUserInfo = () => {
    setUserInfo({
      nickname: "shadows",
      avatarUrl: "",
      gender: 1,
      country: "中国",
      province: "广东",
      city: "深圳",
    });
  }
  useEffect(() => {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为true,表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      const { token } = state;
      console.log('微应用中拿到token值：' + token)
      if (!token) {
        message.error('未检测到登录信息！')
        // 注意：微应用里面的路由跳转是在子应用内部独立运行的
        history.push({
          pathname: '/'
        })
        return;
      }
      // 获取用户信息
      getUserInfo()
    }, true)
  }, [history]);

  if (!userInfo) return null;

  return (
    <section style={{padding: '20px'}}>
      <Descriptions title={`欢迎你，${userInfo.nickname}`}>
        <Descriptions.Item label="Avatar">
          <Avatar src={userInfo.avatarUrl} />
        </Descriptions.Item>
        <Descriptions.Item label="UserName">
          {userInfo.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {userInfo.gender ? "boy" : "girl"}
        </Descriptions.Item>
        <Descriptions.Item label="Live">{`${userInfo.country} ${userInfo.province} ${userInfo.city}`}</Descriptions.Item>
      </Descriptions>
    </section>
  );
};

export default Status;
