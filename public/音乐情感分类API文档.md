# 语音情感分析系统 API 文档

## 概述
本文档描述了语音情感分析系统的所有API接口，包括用户端和管理员端的功能。

## 基础信息
- **认证方式**: Session认证（基于Django Session）
- **数据格式**: JSON
- **用户识别**: 用户端接口通过Session自动识别当前登录用户，无需在URL中传递用户ID

## 用户端接口

### 1. 用户仪表板
**描述**: 获取当前登录用户的仪表板数据，包括该用户的分析统计和最近分析记录

**路由**: `GET /api/speech/client/dashboard/`

**请求参数**: 无

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total_analyses": 25,
        "this_month_analyses": 8,
        "dominant_emotions": {
            "happy": 10,
            "sad": 8,
            "angry": 4,
            "neutral": 3
        },
        "recent_analyses": [
            {
                "id": 1,
                "audio_file": {
                    "id": 1,
                    "original_filename": "speech_sample.wav",
                    "file_format": "wav",
                    "file_size": "2.5 MB",
                    "duration": "00:01:30"
                },
                "emotion_analysis": {
                    "dominant_emotion": "happy",
                    "confidence_score": 0.85,
                    "emotion_scores": {
                        "happy": 0.85,
                        "sad": 0.08,
                        "angry": 0.04,
                        "neutral": 0.03
                    }
                },
                "created_at": "2024-01-15T10:30:00Z"
            }
        ]
    }
}
```

### 2. 音频上传和分析
**描述**: 为当前登录用户上传音频文件并进行情感分析，分析结果将关联到该用户账户

**路由**: `POST /api/speech/client/upload/`

**请求参数**: 无

**请求体** (multipart/form-data):
```
audio_file: <音频文件> (支持格式: wav, mp3, m4a, flac)
```

**请求头**:
```
Content-Type: multipart/form-data
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "分析完成",
    "data": {
        "analysis_id": 1,
        "audio_file": {
            "id": 1,
            "original_filename": "my_speech.wav",
            "file_format": "wav",
            "file_size": "3.2 MB",
            "duration": "00:02:15"
        },
        "emotion_analysis": {
            "dominant_emotion": "happy",
            "confidence_score": 0.92,
            "emotion_scores": {
                "happy": 0.92,
                "sad": 0.03,
                "angry": 0.02,
                "neutral": 0.03
            },
            "processing_time": 2.5
        }
    }
}
```

### 3. 情感分析历史
**描述**: 获取当前登录用户的情感分析历史记录，支持分页和过滤。系统通过Session自动识别用户身份，只返回该用户的分析记录。

**路由**: `GET /api/speech/client/history/`

**请求参数**:
- `page`: 页码 (可选，默认1)
- `page_size`: 每页数量 (可选，默认10)
- `emotion`: 情感过滤 (可选，如: happy, sad, angry, neutral)
- `start_date`: 开始日期 (可选，格式: YYYY-MM-DD)
- `end_date`: 结束日期 (可选，格式: YYYY-MM-DD)

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "count": 25,
        "next": "http://localhost:8000/api/speech/client/history/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "audio_file": {
                    "id": 1,
                    "original_filename": "speech_sample.wav",
                    "file_format": "wav",
                    "file_size": "2.5 MB",
                    "duration": "00:01:30"
                },
                "emotion_analysis": {
                    "dominant_emotion": "happy",
                    "confidence_score": 0.85,
                    "emotion_scores": {
                        "happy": 0.85,
                        "sad": 0.08,
                        "angry": 0.04,
                        "neutral": 0.03
                    }
                },
                "created_at": "2024-01-15T10:30:00Z"
            }
        ]
    }
}
```

### 4. 分析详情
**描述**: 获取当前登录用户的特定分析记录详细信息，只能查看属于该用户的分析记录

**路由**: `GET /api/speech/client/analysis/<int:analysis_id>/`

**请求参数**: 无

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "audio_file": {
            "id": 1,
            "original_filename": "speech_sample.wav",
            "file_format": "wav",
            "file_size": "2.5 MB",
            "duration": "00:01:30",
            "created_at": "2024-01-15T10:25:00Z"
        },
        "emotion_analysis": {
            "dominant_emotion": "happy",
            "confidence_score": 0.85,
            "emotion_scores": {
                "happy": 0.85,
                "sad": 0.08,
                "angry": 0.04,
                "neutral": 0.03
            },
            "processing_time": 2.3
        },
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

### 5. 用户个人资料
**描述**: 获取和更新当前登录用户的个人资料信息

#### 5.1 获取个人资料
**路由**: `GET /api/speech/client/profile/`

**请求参数**: 无

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "张",
            "last_name": "三"
        },
        "phone": "13800138000",
        "avatar": "/static/avatars/default.png",
        "bio": "这是我的个人简介",
        "created_at": "2024-01-01T00:00:00Z"
    }
}
```

#### 5.2 更新个人资料
**路由**: `PUT /api/speech/client/profile/`

**请求参数**: 无

**请求体**:
```json
{
    "phone": "13900139000",
    "bio": "更新后的个人简介"
}
```

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "更新成功",
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "张",
            "last_name": "三"
        },
        "phone": "13900139000",
        "avatar": "/static/avatars/default.png",
        "bio": "更新后的个人简介",
        "created_at": "2024-01-01T00:00:00Z"
    }
}
```

## 管理员端接口

### 1. 管理员仪表板
**描述**: 获取管理员仪表板数据，包括系统统计信息

**路由**: `GET /api/speech/admin/dashboard/`

**请求参数**: 无

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "total_users": 150,
        "total_audio_files": 1250,
        "total_analyses": 1180,
        "storage_used": "15.6 GB",
        "today_analyses": 25,
        "this_month_analyses": 320,
        "emotion_distribution": {
            "happy": 450,
            "sad": 320,
            "angry": 210,
            "neutral": 200
        },
        "recent_activities": [
            {
                "user": "张三",
                "action": "上传音频",
                "filename": "meeting_record.wav",
                "timestamp": "2024-01-15T14:30:00Z"
            }
        ]
    }
}
```

### 2. 用户管理
**描述**: 获取所有用户列表，支持分页和搜索

**路由**: `GET /api/speech/admin/users/`

**请求参数**:
- `page`: 页码 (可选，默认1)
- `page_size`: 每页数量 (可选，默认10)
- `search`: 搜索关键词 (可选)
- `is_active`: 用户状态过滤 (可选，true/false)

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "count": 150,
        "next": "http://localhost:8000/api/speech/admin/users/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "username": "testuser",
                "email": "test@example.com",
                "first_name": "张",
                "last_name": "三",
                "is_active": true,
                "date_joined": "2024-01-01T00:00:00Z",
                "profile": {
                    "phone": "13800138000",
                    "total_analyses": 25
                }
            }
        ]
    }
}
```

### 3. 分析记录管理
**描述**: 获取所有分析记录，支持分页和过滤

**路由**: `GET /api/speech/admin/analyses/`

**请求参数**:
- `page`: 页码 (可选，默认1)
- `page_size`: 每页数量 (可选，默认10)
- `user_id`: 用户ID过滤 (可选)
- `emotion`: 情感过滤 (可选)
- `start_date`: 开始日期 (可选)
- `end_date`: 结束日期 (可选)

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "count": 1180,
        "next": "http://localhost:8000/api/speech/admin/analyses/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "user": {
                    "id": 1,
                    "username": "testuser",
                    "email": "test@example.com"
                },
                "audio_file": {
                    "id": 1,
                    "original_filename": "speech_sample.wav",
                    "file_format": "wav",
                    "file_size": "2.5 MB",
                    "duration": "00:01:30"
                },
                "emotion_analysis": {
                    "dominant_emotion": "happy",
                    "confidence_score": 0.85
                },
                "created_at": "2024-01-15T10:30:00Z"
            }
        ]
    }
}
```

### 4. 系统统计
**描述**: 获取系统统计数据，包括历史趋势

**路由**: `GET /api/speech/admin/statistics/`

**请求参数**:
- `period`: 统计周期 (可选，daily/weekly/monthly，默认daily)
- `days`: 天数 (可选，默认30)

**请求头**:
```
Content-Type: application/json
Cookie: sessionid=<session_id>
```

**返回体**:
```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "current_stats": {
            "total_users": 150,
            "total_audio_files": 1250,
            "total_analyses": 1180,
            "storage_used": "15.6 GB"
        },
        "trend_data": [
            {
                "date": "2024-01-15",
                "new_users": 5,
                "new_analyses": 25,
                "storage_growth": "120 MB"
            },
            {
                "date": "2024-01-14",
                "new_users": 3,
                "new_analyses": 18,
                "storage_growth": "95 MB"
            }
        ],
        "emotion_stats": {
            "happy": 450,
            "sad": 320,
            "angry": 210,
            "neutral": 200
        }
    }
}
```

## 错误响应格式

所有接口在出现错误时都会返回统一的错误格式：

```json
{
    "code": 400,
    "message": "错误描述",
    "data": null
}
```

### 常见错误码
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `413`: 文件过大
- `415`: 不支持的文件格式
- `500`: 服务器内部错误

## 文件上传限制
- **支持格式**: wav, mp3, m4a, flac
- **文件大小**: 最大50MB
- **时长限制**: 最大10分钟
- **存储路径**: `/static/audio_files/YYYY/MM/DD/`

## 认证说明
- 所有接口都需要用户登录认证
- 管理员接口需要管理员权限
- 使用Django Session认证机制
- 认证失败返回401状态码
