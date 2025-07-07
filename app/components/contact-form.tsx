'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  //const [isSubmitting, setIsSubmitting] = useState(false)
  //const [message, setMessage] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const phone = formData.get('phone')
    const message = formData.get('message')
    
    const mailtoLink = `mailto:Office.delta@bk.ru?subject=Новая заявка с сайта&body=Имя: ${name}%0D%0AТелефон: ${phone}%0D%0AСообщение: ${message}`
    
    window.location.href = mailtoLink
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Ваше имя</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="phone">Номер телефона</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>
      <div>
        <Label htmlFor="message">Сообщение</Label>
        <Textarea id="message" name="message" required />
      </div>
      <Button type="submit">
        Отправить заявку
      </Button>
      {/*{message && <p className={message.includes('успешно') ? "text-green-600" : "text-red-600"}>{message}</p>}*/}
    </form>
  )
}
