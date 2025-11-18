'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Wallet, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CategoryTheme } from './category-grid'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const uploadFormSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Submit your photo.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max image size is 10MB.'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .png and .webp formats are supported.'
    ),
  name: z.string().max(50, 'Name must be less than 50 characters.').optional(),
  location: z.string().min(2, 'Where is this?').max(100, 'Location must be less than 100 characters.'),
  description: z.string().min(10, 'Sell it the best you can!').max(500, 'Description must be less than 500 characters.'),
})

type UploadFormValues = z.infer<typeof uploadFormSchema>

interface UploadDialogProps {
  categoryTheme: CategoryTheme
  children: React.ReactNode
}

export function UploadDialog({ categoryTheme, children }: UploadDialogProps) {
  const { login, authenticated, user } = usePrivy()
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: UploadFormValues) => {
    setIsSubmitting(true)

    try {
      // Create FormData to send to API
      const formData = new FormData()
      formData.append('image', data.image[0])
      formData.append('name', data.name || '')
      formData.append('location', data.location)
      formData.append('description', data.description)

      // Log submission details
      console.log('=== UPLOAD SUBMISSION ===')
      console.log('User:', user?.wallet?.address || user?.email?.address)
      console.log('Name:', data.name || '(not provided)')
      console.log('Category:', categoryTheme.title)
      console.log('Location:', data.location)
      console.log('Description:', data.description)
      console.log('Image:', {
        name: data.image[0].name,
        size: data.image[0].size,
        type: data.image[0].type,
      })

      // Upload to Cloudinary via our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      console.log('Upload successful:', result.data)
      console.log('Image URLs:', {
        original: result.data.originalUrl,
        leaderboard: result.data.leaderboardUrl,
        analysis: result.data.analysisUrl,
      })
      console.log('========================')

      // Show success toast with Cloudinary URL
      toast.success('Submission received!', {
        description: 'Your photo has been uploaded successfully. Our AI jury is reviewing it!',
        duration: 4000,
      })

      // Reset form and close dialog
      form.reset()
      setImagePreview(null)

      // Close dialog after a short delay
      setTimeout(() => {
        setOpen(false)
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)

      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Color maps for dynamic styling
  const colorMap: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    amber: {
      border: 'rgba(251, 191, 36, 0.4)',
      glow: 'rgba(251, 191, 36, 0.3)',
      text: 'text-amber-500',
      bg: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400',
    },
    orange: {
      border: 'rgba(251, 146, 60, 0.4)',
      glow: 'rgba(251, 146, 60, 0.3)',
      text: 'text-orange-500',
      bg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400',
    },
    green: {
      border: 'rgba(34, 197, 94, 0.4)',
      glow: 'rgba(34, 197, 94, 0.3)',
      text: 'text-green-500',
      bg: 'bg-gradient-to-r from-green-600 via-green-500 to-green-400',
    },
    emerald: {
      border: 'rgba(52, 211, 153, 0.4)',
      glow: 'rgba(52, 211, 153, 0.3)',
      text: 'text-emerald-500',
      bg: 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400',
    },
    blue: {
      border: 'rgba(59, 130, 246, 0.4)',
      glow: 'rgba(59, 130, 246, 0.3)',
      text: 'text-blue-500',
      bg: 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400',
    },
    sky: {
      border: 'rgba(56, 189, 248, 0.4)',
      glow: 'rgba(56, 189, 248, 0.3)',
      text: 'text-sky-500',
      bg: 'bg-gradient-to-r from-sky-600 via-blue-500 to-sky-400',
    },
    purple: {
      border: 'rgba(168, 85, 247, 0.4)',
      glow: 'rgba(168, 85, 247, 0.3)',
      text: 'text-purple-500',
      bg: 'bg-gradient-to-r from-purple-600 via-violet-500 to-purple-400',
    },
    violet: {
      border: 'rgba(139, 92, 246, 0.4)',
      glow: 'rgba(139, 92, 246, 0.3)',
      text: 'text-violet-500',
      bg: 'bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400',
    },
    yellow: {
      border: 'rgba(234, 179, 8, 0.4)',
      glow: 'rgba(234, 179, 8, 0.3)',
      text: 'text-yellow-500',
      bg: 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400',
    },
  }

  const themeColors = colorMap[categoryTheme.primaryColor] || colorMap.amber

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: `2px solid ${themeColors.border}`,
          boxShadow: `0 0 30px ${themeColors.glow}`,
        }}
      >
        {!authenticated ? (
          // Wallet not connected state
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: `2px solid ${themeColors.border}`,
                boxShadow: `0 0 20px ${themeColors.glow}`,
              }}
            >
              <Wallet className={`w-12 h-12 ${themeColors.text}`} />
            </div>
            <DialogHeader>
              <DialogTitle
                className="text-3xl font-black tracking-tighter mb-4"
                style={{ color: `oklch(0.85 0.08 45)` }}
              >
                Connect Your Wallet
              </DialogTitle>
              <DialogDescription className="text-white/70 text-lg mb-8">
                You need to connect your wallet to submit to the leaderboard.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={login}
              className={`px-8 py-4 rounded-full font-bold text-white ${themeColors.bg} hover:scale-105 transition-transform duration-200 shadow-lg`}
              style={{
                boxShadow: `0 0 20px ${themeColors.glow}`,
              }}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          // Upload form state
          <>
            <DialogHeader>
              <DialogTitle
                className="text-3xl font-black tracking-tighter"
                style={{ color: `oklch(0.85 0.08 45)` }}
              >
                {categoryTheme.emoji} Submit to {categoryTheme.title}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base mt-2">
                Submit your best photo from your Argentine experience and let the AI jury decide if
                it deserves a spot on the leaderboard.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Photo</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="relative">
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(',')}
                              capture="environment"
                              onChange={(e) => {
                                onChange(e.target.files)
                                handleImageChange(e)
                              }}
                              className="hidden"
                              id="photo-upload"
                              {...field}
                            />
                            <label
                              htmlFor="photo-upload"
                              className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                              style={{
                                border: `2px solid ${themeColors.border}`,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                boxShadow: `0 0 15px ${themeColors.glow}`,
                              }}
                            >
                              <UploadIcon className={`w-5 h-5 ${themeColors.text}`} />
                              <span className="text-white font-semibold">
                                {imagePreview ? 'Change Photo' : 'Choose Photo or Take Picture'}
                              </span>
                            </label>
                          </div>
                          {imagePreview && (
                            <div className="flex justify-center">
                              <div
                                className="relative rounded-lg overflow-hidden"
                                style={{
                                  border: `2px solid ${themeColors.border}`,
                                  boxShadow: `0 0 20px ${themeColors.glow}`,
                                }}
                              >
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="max-h-[300px] w-auto object-contain"
                                />
                              </div>
                            </div>
                          )}
                          {!imagePreview && (
                            <div
                              className="flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed"
                              style={{
                                borderColor: themeColors.border,
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              }}
                            >
                              <ImageIcon className={`w-12 h-12 mb-2 ${themeColors.text} opacity-50`} />
                              <p className="text-white/50 text-sm">Preview will appear here</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Your Name (optional nickname)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., vitalik.eth or John"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Don Julio, Palermo"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-offset-0"
                          style={{
                            focusVisible: {
                              ringColor: themeColors.border,
                            },
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">
                        Why should this be on the leaderboard?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us what makes this special..."
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 min-h-[100px] resize-none focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-full font-bold text-white ${themeColors.bg} hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  style={{
                    boxShadow: `0 0 20px ${themeColors.glow}`,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <UploadIcon className="w-5 h-5 animate-pulse" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UploadIcon className="w-5 h-5" />
                      Submit to Leaderboard
                    </span>
                  )}
                </button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
