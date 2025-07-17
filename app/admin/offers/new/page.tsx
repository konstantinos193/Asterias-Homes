"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { offersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function NewOfferPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    active: true,
    code: "",
    titleKey: "",
    descriptionKey: "",
    badgeKey: "",
    roomTypeKey: "",
    includesKeys: "",
    featured: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const dataToSubmit = {
      ...formData,
      includesKeys: formData.includesKeys.split(",").map((s) => s.trim()).filter(Boolean),
    }

    try {
      await offersAPI.create(dataToSubmit)
      toast({
        title: t("common.success"),
        description: t("admin.offers.success.create"),
      })
      router.push("/admin/offers")
    } catch (error) {
      console.error("Failed to create offer", error)
      toast({
        title: t("common.error"),
        description: t("admin.offers.errors.create"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">{t("admin.offers.new.title")}</h1>
          <p className="text-slate-600 font-alegreya">{t("admin.offers.new.subtitle")}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">{t("admin.offers.form.title")}</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="titleKey">{t("admin.offers.form.titleKey")}</Label>
            <Input id="titleKey" name="titleKey" value={formData.titleKey} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <Label htmlFor="description">{t("admin.offers.form.description")}</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="descriptionKey">{t("admin.offers.form.descriptionKey")}</Label>
          <Textarea
            id="descriptionKey"
            name="descriptionKey"
            value={formData.descriptionKey}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="discount">{t("admin.offers.form.discount")}</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="code">{t("admin.offers.form.code")}</Label>
            <Input id="code" name="code" value={formData.code} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate">{t("admin.offers.form.startDate")}</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">{t("admin.offers.form.endDate")}</Label>
            <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="badgeKey">{t("admin.offers.form.badgeKey")}</Label>
            <Input id="badgeKey" name="badgeKey" value={formData.badgeKey} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="roomTypeKey">{t("admin.offers.form.roomTypeKey")}</Label>
            <Input id="roomTypeKey" name="roomTypeKey" value={formData.roomTypeKey} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="includesKeys">{t("admin.offers.form.includesKeys")}</Label>
          <Input
            id="includesKeys"
            name="includesKeys"
            value={formData.includesKeys}
            onChange={handleChange}
            placeholder={t("admin.offers.form.includesKeysPlaceholder")}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "active")}
            />
            <label
              htmlFor="active"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("admin.offers.form.active")}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "featured")}
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("admin.offers.form.featured")}
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Link href="/admin/offers">
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-[#0A4A4A] hover:bg-[#083a3a]">
            {isSubmitting ? t("common.loading") : t("admin.offers.form.create")}
          </Button>
        </div>
      </form>
    </div>
  )
}
