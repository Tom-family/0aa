<template>
  <div class="psychology-login-container">
    <!-- 背景元素 -->
    <div class="background">
      <!-- 呼吸感背景圆圈 -->
      <div class="breathing-circle circle-1"></div>
      <div class="breathing-circle circle-2"></div>
      <div class="breathing-circle circle-3"></div>
      
      <!-- 流动粒子 -->
      <div class="particles">
        <div v-for="(particle, index) in particles" 
             :key="index" 
             class="particle"
             :style="particleStyle(particle)">
        </div>
      </div>
      
      <!-- 神经连接线 -->
      <div class="neural-network">
        <svg width="100%" height="100%">
          <path v-for="(path, index) in neuralPaths" 
                :key="index" 
                :d="path" 
                class="neural-path" />
        </svg>
      </div>
      
      <!-- 浮动思维气泡 -->
      <div v-for="(bubble, index) in bubbles" 
           :key="'bubble-'+index" 
           class="thought-bubble"
           :style="bubbleStyle(bubble)">
        <span class="bubble-text">{{ bubble.text }}</span>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 标题区域 -->
      <div class="title-section">
        <h1 class="main-title">心灵栖息处</h1>
        <p class="subtitle">欢迎回到内心的宁静空间</p>
        <div class="divider"></div>
      </div>
      
      <!-- 预留的表单区域 -->
      <div class="form-placeholder">
        <!-- 这里将放置登录表单 -->
        <div class="form-placeholder-content">
          <div class="placeholder-header">
            <div class="form-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div class="placeholder-footer">
            <div class="link-placeholder"></div>
            <div class="link-placeholder"></div>
          </div>
        </div>
      </div>
      
      <!-- 页脚信息 -->
      <div class="footer">
        <p class="footer-text">探索内心的深度 · 连接真实的自我</p>
        <!-- <p class="copyright">成都云聚教育咨询有限公司</p> -->
      </div>
    </div>
    
    <!-- 呼吸提示 -->
    <div class="breathing-hint">
      <p>跟随圆圈的节奏，深呼吸...</p>
      <div class="breathing-dots">
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 粒子数据
const particles = ref([])
// 思维气泡数据
const bubbles = ref([
  { x: 15, y: 20, size: 40, text: "完美", delay: 0 },
  { x: 85, y: 30, size: 50, text: "力量", delay: 1 },
  { x: 20, y: 70, size: 45, text: "活泼", delay: 2 },
  { x: 75, y: 80, size: 35, text: "平和", delay: 3 }
])

// 神经网络路径
const neuralPaths = ref([
  "M10,50 Q50,10 90,50 T170,90",
  "M30,20 Q60,60 100,30 T150,70",
  "M70,10 Q110,40 130,20 T180,40",
  "M20,80 Q60,90 80,60 T140,80"
])

// 初始化粒子
const initParticles = () => {
  const particlesArray = []
  for (let i = 0; i < 40; i++) {
    particlesArray.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
      direction: Math.random() * Math.PI * 2
    })
  }
  particles.value = particlesArray
}

// 粒子样式
const particleStyle = (particle) => {
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity,
    animationDuration: `${5 / particle.speed}s`
  }
}

// 气泡样式
const bubbleStyle = (bubble) => {
  return {
    left: `${bubble.x}%`,
    top: `${bubble.y}%`,
    width: `${bubble.size}px`,
    height: `${bubble.size}px`,
    animationDelay: `${bubble.delay}s`
  }
}

// 动画循环
let animationFrameId = null
const animateParticles = () => {
  particles.value.forEach(particle => {
    // 更新粒子位置
    particle.x += Math.cos(particle.direction) * particle.speed
    particle.y += Math.sin(particle.direction) * particle.speed
    
    // 边界检查
    if (particle.x > 100) particle.x = 0
    if (particle.x < 0) particle.x = 100
    if (particle.y > 100) particle.y = 0
    if (particle.y < 0) particle.y = 100
    
    // 轻微改变方向
    particle.direction += (Math.random() - 0.5) * 0.1
  })
  
  animationFrameId = requestAnimationFrame(animateParticles)
}

// 组件挂载时初始化
onMounted(() => {
  initParticles()
  animateParticles()
})

// 组件卸载时清理
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.psychology-login-container {
  min-width: 750px;
  min-height: 820px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  color: #e0e0e0;
}

/* 背景样式 */
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 呼吸圆圈 */
.breathing-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(123, 97, 255, 0.3);
  box-shadow: 0 0 30px rgba(123, 97, 255, 0.1);
  z-index: 1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation: breathe 8s ease-in-out infinite;
}

.circle-2 {
  width: 450px;
  height: 450px;
  bottom: 10%;
  right: 5%;
  animation: breathe 10s ease-in-out infinite reverse;
  border-color: rgba(102, 126, 234, 0.3);
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 80%;
  animation: breathe 6s ease-in-out infinite;
  border-color: rgba(86, 207, 225, 0.3);
}

/* 呼吸动画 */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

/* 粒子 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(123, 97, 255, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(-20px) translateX(0);
  }
  75% {
    transform: translateY(-10px) translateX(-5px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

/* 神经网络 */
.neural-network {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.neural-path {
  fill: none;
  stroke: rgba(102, 126, 234, 0.1);
  stroke-width: 1;
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0%, 100% {
    stroke-width: 1;
    opacity: 0.1;
  }
  50% {
    stroke-width: 1.5;
    opacity: 0.3;
  }
}

/* 思维气泡 */
.thought-bubble {
  position: absolute;
  background: rgba(123, 97, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(123, 97, 255, 0.3);
  animation: bubble-float 15s ease-in-out infinite;
  z-index: 1;
}

@keyframes bubble-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-20px) scale(1.05);
  }
  50% {
    transform: translateY(0) scale(1);
  }
  75% {
    transform: translateY(20px) scale(0.95);
  }
}

.bubble-text {
  font-size: 14px;
  font-weight: 300;
  color: rgba(224, 224, 224, 0.7);
}

/* 主内容 */
.main-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 1s ease-out;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 300;
  letter-spacing: 3px;
  margin-bottom: 10px;
  background: linear-gradient(to right, #7b61ff, #667eea, #56cfe1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 2px;
  margin-bottom: 20px;
  color: #a0a0c0;
}

.divider {
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, #7b61ff, transparent);
  margin: 0 auto;
}

/* 表单占位区域 */
.form-placeholder {
  width: 100%;
  max-width: 420px;
  background: rgba(20, 20, 40, 0.7);
  border-radius: 16px;
  padding: 40px 40px 20px 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(123, 97, 255, 0.2);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(123, 97, 255, 0.1),
    inset 0 0 20px rgba(123, 97, 255, 0.05);
  animation: fadeInUp 1s ease-out 0.3s both;
  margin-bottom: 40px;
  height: 470px;

}

.form-placeholder-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  height: 100%;
  /* background: red; */
}

.placeholder-header {
  text-align: center;
}

.form-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(123, 97, 255, 0.1);
  border: 1px solid rgba(123, 97, 255, 0.3);
  margin-bottom: 15px;
  color: #7b61ff;
}


@keyframes pulse-bg {
  0%, 100% {
    background-color: rgba(30, 30, 60, 0.5);
  }
  50% {
    background-color: rgba(40, 40, 70, 0.5);
  }
}

@keyframes button-glow {
  0% {
    box-shadow: 0 5px 15px rgba(123, 97, 255, 0.3);
  }
  100% {
    box-shadow: 0 5px 25px rgba(123, 97, 255, 0.6);
  }
}

.placeholder-footer {
  display: flex;
  justify-content: space-between;
}

.link-placeholder {
  width: 100px;
  height: 16px;
  background: rgba(123, 97, 255, 0.2);
  border-radius: 4px;
}

/* 页脚 */
.footer {
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 1s ease-out 0.6s both;
}

.footer-text {
  font-size: 1rem;
  color: #a0a0c0;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.copyright {
  font-size: 0.9rem;
  color: #666699;
}

/* 呼吸提示 */
.breathing-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
  color: #a0a0c0;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.breathing-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7b61ff;
  opacity: 0.6;
}

.dot-1 {
  animation: dot-breathe 2s infinite;
}

.dot-2 {
  animation: dot-breathe 2s infinite 0.3s;
}

.dot-3 {
  animation: dot-breathe 2s infinite 0.6s;
}

@keyframes dot-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

/* 进入动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式调整 */
/* @media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .form-placeholder {
    max-width: 90%;
    padding: 30px 25px;
  }
  
  .circle-1, .circle-2, .circle-3 {
    display: none;
  }
} */
</style>