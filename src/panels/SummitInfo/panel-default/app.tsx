import React, { useEffect, useState } from 'react';
import { entryWrap } from '@src/entryWrap';
import { useDeviceInfo } from '@hooks/useDeviceInfo';
import { StatusTip } from '@components/StatusTip';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import * as util from './utils';
import './SummitInfo.less';

const enum DEVICE_DATA {
  COMPANY = 'company',
  POSITION = 'position',
  NAME = 'name',
}

function App() {
  const [{ statusTip }] = useDeviceInfo();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    name: '',
  });

  useEffect(() => {
    console.log('statusTip=', statusTip);
    if (!statusTip) {
      getDeviceData().then((deviceData) => {
        console.log('【初始化物模型】', deviceData);
        setFormData(deviceData);
      });
    }
  }, [statusTip]);

  /**
   * 获取物模型 并转换字符串
   */
  const getDeviceData = async () => {
    const deviceData = await sdk.getDeviceData();
    deviceData[DEVICE_DATA.COMPANY] = util.gbkHexStrToUtfStr(deviceData[DEVICE_DATA.COMPANY].Value);
    deviceData[DEVICE_DATA.POSITION] = util.gbkHexStrToUtfStr(deviceData[DEVICE_DATA.POSITION].Value);
    deviceData[DEVICE_DATA.NAME] = util.gbkHexStrToUtfStr(deviceData[DEVICE_DATA.NAME].Value);
    return deviceData;
  };

  /**
   * 输入更新表单
   * @param event
   * @param key
   */
  const updateFormData = (event, key) => {
    event.persist();
    setFormData({
      ...formData,
      [key]: event.target.value,
    });
  };

  /**
   * 提交表单
   */
  const summitForm = async () => {
    try {
      console.log('【提交表单】', formData, sdk.deviceData);
      if (Object.values(formData).includes('')) {
        sdk.tips.showInfo('请完善信息');
        return;
      }
      const deviceData = {
        [DEVICE_DATA.COMPANY]: util.utfStrToGbkHexStr(formData.company),
        [DEVICE_DATA.POSITION]: util.utfStrToGbkHexStr(formData.position),
        [DEVICE_DATA.NAME]: util.utfStrToGbkHexStr(formData.name),
      };
      sdk.tips.showLoading('提交中');
      console.log('【control物模型】', deviceData);
      await sdk.controlDeviceData(deviceData);
      sdk.tips.alert('提交成功');
    } catch (e) {
      console.log('改变物模型错误', e);
      sdk.tips.alert('提交信息错误');
    } finally {
      await sdk.tips.hideLoading();
    }
  };

  return (
    statusTip ? <StatusTip fillContainer {...statusTip} /> : (
      <div className="summit-page">
        <main>
          {/* logo */}
          <div className="logo">
            <div className="logo-header">
              <img
                src="https://main.qcloudimg.com/raw/be92a4afa0023d1c7720833f9ef9c7e8.png"
                alt="腾讯连连"
                className="logo-image"
              />
              <div className="logo-title">腾讯连连</div>
            </div>
            <div className="logo-text">欢迎您莅临光临</div>
          </div>

          {/* 表单 */}
          <div className="summit-form">
            <div className="form-item">
              <div className="form-item-label">公司</div>
              <div className="form-item-input">
                <input type="text" placeholder="请输入公司名称" value={formData.company}
                       onChange={e => updateFormData(e, 'company')} />
              </div>
            </div>
            <div className="form-item">
              <div className="form-item-label">职位</div>
              <div className="form-item-input">
                <input type="text" placeholder="请输入职位" value={formData.position}
                       onChange={e => updateFormData(e, 'position')} />
              </div>
            </div>
            <div className="form-item">
              <div className="form-item-label">姓名</div>
              <div className="form-item-input">
                <input type="text" placeholder="请输入姓名" value={formData.name}
                       onChange={e => updateFormData(e, 'name')} />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="summit-btn" onClick={summitForm}>提交</div>
        </main>
      </div>
    )
  );
}

entryWrap(App);
