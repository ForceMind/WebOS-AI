import React, { useState } from 'react';
import { calculateFortune } from './utils/fortune';

function App() {
  const [formData, setFormData] = useState({
    year: 1996,
    month: 12,
    day: 23,
    hour: 20,
    minute: 35,
    gender: 1 // 1男 0女
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // 模拟计算延迟，增加仪式感
    setTimeout(() => {
      const res = calculateFortune(
        formData.year,
        formData.month,
        formData.day,
        formData.hour,
        formData.minute,
        parseInt(formData.gender)
      );
      setResult(res);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif text-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#8b4513] mb-4 tracking-widest border-b-4 border-[#8b4513] inline-block pb-2">
            天机神算
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            批八字 · 测紫微 · 断吉凶
          </p>
        </header>

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 border border-[#e5e7eb] mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#8b4513]"></div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">出生年份 (公历)</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#8b4513] focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">出生月份</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#8b4513] outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">出生日期</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#8b4513] outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">出生时辰 (小时)</label>
                <select
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#8b4513] outline-none"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(h => (
                    <option key={h} value={h}>{h}时</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">分钟 (可选)</label>
                <input
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#8b4513] outline-none"
                  min="0"
                  max="59"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-700">性别</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="1"
                    checked={formData.gender == 1}
                    onChange={handleChange}
                    className="text-[#8b4513] focus:ring-[#8b4513]"
                  />
                  <span>男命</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="0"
                    checked={formData.gender == 0}
                    onChange={handleChange}
                    className="text-[#8b4513] focus:ring-[#8b4513]"
                  />
                  <span>女命</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded text-white font-bold text-lg transition-all duration-300 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8b4513] hover:bg-[#6d360f] shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? '正在推演天机...' : '立即批算'}
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {result && (
          <div className="space-y-8 animate-fade-in pb-20">
            
            {/* 1. 命主八字排盘 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#8b4513]">
              <h2 className="text-2xl font-bold mb-4 text-[#8b4513]">命主八字排盘</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><span className="font-bold">公历：</span>{result.basic.solar}（{result.basic.gender}）</p>
                <p><span className="font-bold">八字：</span>{result.basic.bazi}</p>
                <p><span className="font-bold">五行：</span>{result.basic.wuxing}</p>
                <p><span className="font-bold">日主：</span>{result.basic.dayMaster}</p>
              </div>
            </div>

            {/* 2. 核心命局解析 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6 text-center text-[#8b4513] border-b pb-2">核心命局解析</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">1. 格局特点：</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                    {result.core.patterns.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">2. 命理断语：</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                    {result.core.specifics.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. 一生运势关键节点 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6 text-center text-[#8b4513] border-b pb-2">一生运势关键节点</h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3 text-[#8b4513] bg-orange-50 inline-block px-2 py-1 rounded">学业阶段</h4>
                <div className="space-y-4 pl-2 border-l-2 border-gray-200 ml-2">
                  {result.milestones.study.map((item, i) => (
                    <div key={i} className="pl-4 relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 bg-[#8b4513] rounded-full border-2 border-white"></div>
                      <h5 className="font-bold text-gray-800">{item.title}</h5>
                      <p className="text-gray-600 text-sm whitespace-pre-line mt-1">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 text-[#8b4513] bg-orange-50 inline-block px-2 py-1 rounded">财富事业</h4>
                <div className="space-y-4 pl-2 border-l-2 border-gray-200 ml-2">
                  {result.milestones.career.map((item, i) => (
                    <div key={i} className="pl-4 relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 bg-[#8b4513] rounded-full border-2 border-white"></div>
                      <h5 className="font-bold text-gray-800">{item.title}</h5>
                      <p className="text-gray-600 text-sm whitespace-pre-line mt-1">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 婚姻感情 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6 text-center text-[#8b4513] border-b pb-2">婚姻感情</h3>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold">妻星定位：</span>{result.marriage.spouse}</p>
                <p><span className="font-bold">成婚年份：</span>{result.marriage.timing}</p>
                <p><span className="font-bold">婚姻质量：</span>{result.marriage.quality}</p>
              </div>
            </div>

            {/* 5. 终极论断 */}
            <div className="bg-[#2c1810] text-orange-50 p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center border-b border-orange-800 pb-4">终极论断</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-orange-200 mb-1">1. 财富层级：</h4>
                  <p className="opacity-90">{result.verdict.wealth}</p>
                </div>
                <div>
                  <h4 className="font-bold text-orange-200 mb-1">2. 命局核心矛盾：</h4>
                  <p className="opacity-90">{result.verdict.contradiction}</p>
                </div>
                <div>
                  <h4 className="font-bold text-orange-200 mb-1">3. 改进建议：</h4>
                  <p className="opacity-90">{result.verdict.advice}</p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-orange-900 text-center italic text-sm opacity-60">
                结语：此命如{result.core.body.substring(0, 4)}，顺其性当敛锋芒、守拙业，方得晚景平宁。
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-400 mt-8">
              * 本结果仅供娱乐参考，命运掌握在自己手中 *
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
