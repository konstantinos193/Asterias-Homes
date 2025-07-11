"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, UploadCloud, XCircle } from "lucide-react"

interface OfferImage {
  file: File
  preview: string
  isPrimary: boolean
}

export default function AdminNewOfferPage() {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [discount, setDiscount] = useState("")
  const [validFrom, setValidFrom] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [status, setStatus] = useState("active") // 'active' or 'inactive'
  const [images, setImages] = useState<OfferImage[]>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && images.length < 3) {
      const newFiles = Array.from(event.target.files).slice(0, 3 - images.length)
      const newOfferImages: OfferImage[] = newFiles.map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0, // Set first uploaded image as primary if no images yet
      }))
      setImages((prevImages) => [...prevImages, ...newOfferImages])
    }
    // Reset file input to allow selecting the same file again if removed
    event.target.value = ""
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove]
    URL.revokeObjectURL(imageToRemove.preview) // Clean up object URL
    const remainingImages = images.filter((_, index) => index !== indexToRemove)
    // If primary image is removed, and there are other images, set the new first one as primary
    if (imageToRemove.isPrimary && remainingImages.length > 0) {
      remainingImages[0].isPrimary = true
    }
    setImages(remainingImages)
  }

  const handleSetPrimaryImage = (indexToSet: number) => {
    setImages((prevImages) =>
      prevImages.map((image, index) => ({
        ...image,
        isPrimary: index === indexToSet,
      })),
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, you'd send this data to your backend
    const formData = {
      name,
      description,
      discount,
      validFrom,
      validUntil,
      status,
      images: images.map((img) => ({
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
        isPrimary: img.isPrimary,
      })), // Example: sending file info
    }
    console.log("New Offer Data:", formData)
    // Potentially redirect or show a success message
    alert("Offer created (see console for data)!")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">{t("admin.offers.new.title")}</h1>
          <p className="text-slate-600 font-alegreya">{t("admin.offers.new.subtitle")}</p>
        </div>
        <Link href="/admin/offers">
          <Button variant="outline" className="font-alegreya">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("admin.offers.backToList")}
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-cormorant text-xl font-light text-slate-700">
              {t("admin.offers.form.details")}
            </CardTitle>
            <CardDescription className="font-alegreya">{t("admin.offers.form.detailsSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-alegreya text-slate-700">
                  {t("admin.offers.form.nameLabel")}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("admin.offers.form.namePlaceholder")}
                  required
                  className="font-alegreya"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount" className="font-alegreya text-slate-700">
                  {t("admin.offers.form.discountLabel")}
                </Label>
                <Input
                  id="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder={t("admin.offers.form.discountPlaceholder")}
                  className="font-alegreya"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-alegreya text-slate-700">
                {t("admin.offers.form.descriptionLabel")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("admin.offers.form.descriptionPlaceholder")}
                rows={4}
                className="font-alegreya"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="validFrom" className="font-alegreya text-slate-700">
                  {t("admin.offers.form.validFromLabel")}
                </Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="font-alegreya"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil" className="font-alegreya text-slate-700">
                  {t("admin.offers.form.validUntilLabel")}
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="font-alegreya"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="font-alegreya text-slate-700">
                  {t("admin.offers.form.statusLabel")}
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="font-alegreya">
                    <SelectValue placeholder={t("admin.offers.form.statusLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="font-alegreya">
                      {t("admin.offers.form.statusActive")}
                    </SelectItem>
                    <SelectItem value="inactive" className="font-alegreya">
                      {t("admin.offers.form.statusInactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-alegreya text-slate-700">{t("admin.offers.form.imagesLabel")}</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center">
                <Input
                  id="imageUpload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 3}
                />
                <Label
                  htmlFor="imageUpload"
                  className={`cursor-pointer inline-flex items-center justify-center p-4 rounded-md 
                            ${images.length >= 3 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  <UploadCloud className="h-8 w-8 mr-2" />
                  <span className="font-alegreya">{t("admin.offers.form.imagesPlaceholder")}</span>
                </Label>
                <p className="text-xs text-slate-500 mt-2 font-alegreya">{t("admin.offers.form.imageUploadNote")}</p>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group border rounded-md overflow-hidden">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={`Offer image ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mb-1 text-xs bg-white/80 hover:bg-white"
                          onClick={() => handleSetPrimaryImage(index)}
                          disabled={image.isPrimary}
                        >
                          {image.isPrimary
                            ? t("admin.offers.form.primaryImageSet")
                            : t("admin.offers.form.setAsPrimary")}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">{t("admin.offers.form.removeImageLabel")}</span>
                        </Button>
                      </div>
                      {image.isPrimary && (
                        <div className="absolute top-1 left-1 bg-[#0A4A4A] text-white text-xs px-2 py-0.5 rounded-sm font-alegreya">
                          {t("admin.offers.form.primary")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6 border-t">
            <Link href="/admin/offers">
              <Button type="button" variant="outline" className="font-alegreya">
                {t("admin.offers.form.cancelButton")}
              </Button>
            </Link>
            <Button type="submit" className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
              {t("admin.offers.form.saveButton")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
