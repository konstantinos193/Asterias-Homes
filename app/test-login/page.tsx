'use client'

import { useState } from 'react'

export default function TestLogin() {
  const [result, setResult] = useState<string>('')

  const testLogin = async () => {
    try {
      setResult('Testing login...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'konstantinosblavakis@gmail.com', 
          password: 'Kk.25102002?' 
        })
      })
      
      const cookies = response.headers.get('set-cookie')
      const data = await response.json()
      
      setResult(`
Status: ${response.status}
Cookies: ${cookies}
Response: ${JSON.stringify(data, null, 2)}
      `)
      
      if (cookies) {
        // Test profile with cookies
        const profileResponse = await fetch('/api/auth/profile', {
          headers: { 'Cookie': cookies }
        })
        
        const profileData = await profileResponse.json()
        setResult(prev => prev + `\n\nProfile Status: ${profileResponse.status}\nProfile: ${JSON.stringify(profileData, null, 2)}`)
      }
      
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test Login</h1>
      <button onClick={testLogin} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Test Login
      </button>
      <pre style={{ background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </div>
  )
}
