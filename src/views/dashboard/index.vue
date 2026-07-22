<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Document, Folder, Collection } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getDataTotal, getArticleTrend } from '@/api/data'
import type { DataTotalVO } from '@/types/data'

const dataTotal = ref<DataTotalVO>({
  articleTotal: 0,
  categoryTotal: 0,
  tagTotal: 0
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initData = async () => {
  try {
    const totalRes = await getDataTotal()
    dataTotal.value = totalRes.data.data
    
    const trendRes = await getArticleTrend(6)
    const trendData = trendRes.data.data
    
    initChart(trendData.monthList, trendData.newArticleTotalList)
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

const initChart = (monthList: string[], dataList: number[]) => {
  if (!chartRef.value) return
  
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  
  const option = {
    title: {
      text: '新增文章趋势 (近半年数据)',
      left: 'left',
      textStyle: {
        color: '#303133',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthList,
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      name: '(篇数)',
      nameTextStyle: {
        color: '#909399',
        padding: [0, 20, 0, 0]
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    series: [
      {
        name: '新增文章',
        type: 'line',
        smooth: true,
        data: dataList,
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.05)'
            }
          ])
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

const resizeHandler = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initData()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-left">
              <div class="card-title">文章数</div>
              <div class="card-value">{{ dataTotal.articleTotal }} <span class="unit">篇</span></div>
            </div>
            <div class="card-right">
              <el-icon class="card-icon text-blue-500"><Document /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-left">
              <div class="card-title">分类数</div>
              <div class="card-value">{{ dataTotal.categoryTotal }} <span class="unit">个</span></div>
            </div>
            <div class="card-right">
              <el-icon class="card-icon text-green-500"><Folder /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-left">
              <div class="card-title">标签数</div>
              <div class="card-value">{{ dataTotal.tagTotal }} <span class="unit">个</span></div>
            </div>
            <div class="card-right">
              <el-icon class="card-icon text-orange-500"><Collection /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card shadow="hover" class="chart-card">
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  /* No specific padding needed if app-main handles it, but let's add minor adjustments if needed */
}

.data-card {
  border-radius: 8px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.card-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.unit {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
  margin-left: 4px;
}

.card-icon {
  font-size: 54px;
  opacity: 0.8;
  padding: 10px;
  border-radius: 12px;
  background-color: #f5f7fa;
}

.text-blue-500 {
  color: #409eff;
  background-color: #ecf5ff;
}

.text-green-500 {
  color: #67c23a;
  background-color: #f0f9eb;
}

.text-orange-500 {
  color: #e6a23c;
  background-color: #fdf6ec;
}

.chart-card {
  margin-top: 20px;
  border-radius: 8px;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>
