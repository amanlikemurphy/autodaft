import { useState } from 'react'
import { format } from 'date-fns'
import * as Icons from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import { Calendar } from '@/components/ui/calendar'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { submitPreferences } from './services/api.service'
import { Toaster, toast } from 'react-hot-toast'
import { cn } from "@/lib/utils"
import { FormValues, FormFieldProps, CardProps, LabelProps, InputProps, TextareaProps } from './types'

// Constants
const bedrooms = ['Any', '1', '2', '3', '4', '5+']
const housemates = ['1', '2', '3', '4', '5+']
const propertyTypes = ['house', 'apartment', 'studio', 'flat']

function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border border-gray-700", className)}>
      {children}
    </div>
  )
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold">{children}</h2>
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-400">{children}</p>
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-0 md:px-12">{children}</div>
}

function Label({ children, htmlFor, required }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold text-gray-300 flex items-center gap-2">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400",
        "resize-y",
        className
      )}
      {...props}
    />
  )
}

// Define the form schema
const formSchema = z.object({
  listingType: z.enum(['rent', 'shared']),
  firstName: z.string().min(2, 'First name must be at least 2 characters').nonempty('First name is required'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').nonempty('Last name is required'),
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
  phone: z.string().regex(/^\+?[0-9\s-]{8,}$/, 'Please enter a valid phone number').nonempty('Phone number is required'),
  location: z.string().min(1, 'Please select a location').nonempty('Location is required'),
  propertyType: z.string().min(1, 'Please select a property type').nonempty('Property type is required'),
  minPrice: z.number().min(0).max(5000),
  maxPrice: z.number().min(0).max(5000),
  
  // Simplified rentDetails and sharedDetails
  rentDetails: z.object({
    minBedrooms: z.string().optional(),
    maxBedrooms: z.string().optional(),
  }).optional(),
  
  sharedDetails: z.object({}).optional(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .nonempty('Message is required'),
  endDate: z.date({
    required_error: 'Please select an end date',
    invalid_type_error: 'Please select a valid date',
  }),
})

type FormValues = z.infer<typeof formSchema>

function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label} required={required}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingType: 'rent',
      minPrice: 1000,
      maxPrice: 2000,
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form
  const listingType = form.watch('listingType')

  const onSubmit = async (data: FormValues) => {
    try {
      await submitPreferences(data)
      toast.success('Your preferences have been submitted successfully! We will start searching for properties matching your criteria.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '8px',
          border: '1px solid #374151',
        },
      })
      form.reset() // Reset form after successful submission
    } catch (error) {
      toast.error('Failed to submit preferences. Please try again.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '8px',
          border: '1px solid #374151',
        },
      })
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#151515]">
      <Toaster />
      <div className="w-full px-4 py-6">
        {/* Header */}
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-400">
              Automated Property Applications
            </h1>
            <p className="text-gray-300">
              Streamline your property search on Daft.ie
            </p>
          </div>

          {/* Main Form */}
          <Card className="bg-gray-900">
            <CardHeader>
              <CardTitle className="text-center text-white text-2xl">
                Your Application Preferences
              </CardTitle>
              <CardDescription className="text-center mt-2 text-gray-400">
                Fill in your preferences below and we'll handle the rest
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-8">
                {/* Listing Type */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={listingType === 'rent' ? 'default' : 'outline'}
                    className={cn(
                      'h-20 flex flex-col items-center justify-center gap-2',
                      listingType === 'rent' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                    )}
                    onClick={() => form.setValue('listingType', 'rent')}
                  >
                    <Icons.Home className="w-6 h-6" />
                    <span>Rent</span>
                  </Button>
                  <Button
                    type="button"
                    variant={listingType === 'shared' ? 'default' : 'outline'}
                    className={cn(
                      'h-20 flex flex-col items-center justify-center gap-2',
                      listingType === 'shared' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                    )}
                    onClick={() => form.setValue('listingType', 'shared')}
                  >
                    <Icons.Users className="w-6 h-6" />
                    <span>Shared</span>
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="First Name" 
                    error={errors.firstName?.message}
                    required
                  >
                    <Input
                      {...register('firstName')}
                      className={cn(
                        errors.firstName && "border-red-500 focus:ring-red-500"
                      )}
                      placeholder="Enter your first name"
                    />
                  </FormField>

                  <FormField 
                    label="Last Name" 
                    error={errors.lastName?.message}
                    required
                  >
                    <Input
                      {...register('lastName')}
                      className={cn(
                        errors.lastName && "border-red-500 focus:ring-red-500"
                      )}
                      placeholder="Enter your last name"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" required>
                      <Icons.Mail className="w-4 h-4" />
                      Email for Notifications
                    </Label>
                    <Input
                      {...register('email')}
                      id="email"
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" required>
                      <Icons.Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      {...register('phone')}
                      id="phone"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Location and Price Range */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <Label htmlFor="location" required>
                      <Icons.MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Select.Root onValueChange={(value) => form.setValue('location', value)}>
                      <Select.Trigger className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-md h-10 px-3 flex items-center justify-between">
                        <Select.Value placeholder="Select location" />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md overflow-hidden">
                          <Select.Viewport>
                            {['Dublin', 'Galway', 'Cork', 'Limerick', 'Waterford'].map((city) => (
                              <Select.Item key={city.toLowerCase()} value={city.toLowerCase()} className="p-2 hover:bg-gray-700 cursor-pointer">
                                <Select.ItemText>{city}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType" required>
                      <Icons.Home className="w-4 h-4" />
                      Property Type
                    </Label>
                    <Select.Root onValueChange={(value) => form.setValue('propertyType', value)}>
                      <Select.Trigger className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-md h-10 px-3 flex items-center justify-between">
                        <Select.Value placeholder="Select property type" />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md overflow-hidden">
                          <Select.Viewport>
                            {propertyTypes.map((type) => (
                              <Select.Item key={type} value={type} className="p-2 hover:bg-gray-700 cursor-pointer">
                                <Select.ItemText>{type.charAt(0).toUpperCase() + type.slice(1)}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    {errors.propertyType && (
                      <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
                    )}
                  </div>
                </div>

                {/* Price Range with added margin-top */}
                <div className="space-y-4 mt-8">
                  <Label>
                    <Icons.Euro className="w-4 h-4" />
                    Price Range (€)
                  </Label>
                  <div className="pt-4">
                    <Slider.Root
                      className="relative flex items-center w-full h-5"
                      defaultValue={[1000, 2000]}
                      min={0}
                      max={5000}
                      step={50}
                      minStepsBetweenThumbs={1}
                      onValueChange={([min, max]) => {
                        form.setValue('minPrice', min);
                        form.setValue('maxPrice', max);
                      }}
                    >
                      <Slider.Track className="bg-gray-700 relative grow h-1 rounded-full">
                        <Slider.Range className="absolute bg-blue-600 h-full rounded-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-5 h-5 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Minimum price"
                      />
                      <Slider.Thumb
                        className="block w-5 h-5 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Maximum price"
                      />
                    </Slider.Root>
                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                      <span>€{form.getValues('minPrice') || 0}</span>
                      <span>€{form.getValues('maxPrice') || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Rent-specific criteria */}
                {listingType === 'rent' && (
                  <div className="space-y-6 mt-8">
                    {/* Bedrooms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minBedrooms">Min Bedrooms</Label>
                        <Select.Root onValueChange={(value) => form.setValue('rentDetails.minBedrooms', value)}>
                          <Select.Trigger id="minBedrooms" className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-md h-10 px-3 flex items-center justify-between">
                            <Select.Value placeholder="Select" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md overflow-hidden">
                              <Select.Viewport>
                                {bedrooms.map((bedroom) => (
                                  <Select.Item key={bedroom} value={bedroom} className="p-2 hover:bg-gray-700 cursor-pointer">
                                    <Select.ItemText>{bedroom}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxBedrooms">Max Bedrooms</Label>
                        <Select.Root onValueChange={(value) => form.setValue('rentDetails.maxBedrooms', value)}>
                          <Select.Trigger id="maxBedrooms" className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-md h-10 px-3 flex items-center justify-between">
                            <Select.Value placeholder="Select" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md overflow-hidden">
                              <Select.Viewport>
                                {bedrooms.map((bedroom) => (
                                  <Select.Item key={bedroom} value={bedroom} className="p-2 hover:bg-gray-700 cursor-pointer">
                                    <Select.ItemText>{bedroom}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shared-specific criteria */}
                {listingType === 'shared' && (
                  <div className="space-y-6 mt-8">
                    {/* No specific criteria for shared listings anymore */}
                  </div>
                )}

                {/* Message */}
                <div className="space-y-4 mt-8">
                  <Label htmlFor="message" required>
                    <Icons.MessageSquare className="w-4 h-4" />
                    Message to Landlords
                  </Label>
                  <Textarea
                    {...register('message')}
                    id="message"
                    placeholder="Enter your message here..."
                    className="h-32 text-white min-h-[128px]"
                    maxLength={1000}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="text-sm text-gray-400 text-right">
                    Maximum 1000 characters
                  </p>
                </div>

                {/* End Date */}
                <div className="space-y-4 mt-8">
                  <Label required>
                    <Icons.CalendarIcon className="w-4 h-4" />
                    End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !form.getValues('endDate') && 'text-gray-400',
                          'bg-gray-800 text-gray-100 border-gray-700'
                        )}
                      >
                        {form.getValues('endDate') ? format(form.getValues('endDate'), 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={form.getValues('endDate')}
                        onSelect={(date) => form.setValue('endDate', date)}
                        initialFocus
                        className="bg-gray-900 text-gray-100"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 mt-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center pb-8">
            <Button className="gap-2 bg-gray-800 text-gray-100 hover:bg-gray-700">
              <Icons.Coffee className="w-4 h-4" />
              Buy me a coffee
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
