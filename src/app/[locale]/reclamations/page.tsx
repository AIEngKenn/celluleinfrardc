import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, AlertCircle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'complaints' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ComplaintsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'complaints' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('description')}</p>
      </div>

      {/* Info Banner */}
      <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="text-sm text-blue-900">
            <p className="mb-1 font-semibold">
              {locale === 'fr' ? 'Votre voix compte' : 'Your voice matters'}
            </p>
            <p>
              {locale === 'fr'
                ? "La Cellule Infrastructures s'engage à traiter toutes les réclamations avec sérieux et transparence. Chaque soumission reçoit un numéro de suivi unique."
                : 'The Infrastructure Unit is committed to handling all complaints seriously and transparently. Each submission receives a unique tracking number.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('submit')}
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t('track')}
          </TabsTrigger>
        </TabsList>

        {/* Submit Complaint Tab */}
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>{t('submitComplaint')}</CardTitle>
              <CardDescription>
                {locale === 'fr'
                  ? 'Remplissez le formulaire ci-dessous pour soumettre votre réclamation'
                  : 'Fill out the form below to submit your complaint'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">{t('form.personalInfo')}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('form.firstName')}</Label>
                      <Input id="firstName" placeholder={t('form.firstName')} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('form.lastName')}</Label>
                      <Input id="lastName" placeholder={t('form.lastName')} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input id="email" type="email" placeholder="example@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('form.phone')}</Label>
                      <Input id="phone" type="tel" placeholder="+243 XXX XXX XXX" />
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">{t('form.complaintDetails')}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('category')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              locale === 'fr' ? 'Sélectionnez une catégorie' : 'Select a category'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality">{t('categories.quality')}</SelectItem>
                          <SelectItem value="delay">{t('categories.delay')}</SelectItem>
                          <SelectItem value="corruption">{t('categories.corruption')}</SelectItem>
                          <SelectItem value="environment">{t('categories.environment')}</SelectItem>
                          <SelectItem value="safety">{t('categories.safety')}</SelectItem>
                          <SelectItem value="other">{t('categories.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('form.subject')}</Label>
                      <Input
                        id="subject"
                        placeholder={
                          locale === 'fr' ? 'Objet de la réclamation' : 'Subject of complaint'
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('form.message')}</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder={
                          locale === 'fr'
                            ? 'Décrivez votre réclamation en détail...'
                            : 'Describe your complaint in detail...'
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachments">{t('form.attachments')}</Label>
                      <Input id="attachments" type="file" multiple className="cursor-pointer" />
                      <p className="text-xs text-gray-500">
                        {locale === 'fr'
                          ? 'PDF, images, ou documents Word (max 10 MB par fichier)'
                          : 'PDF, images, or Word documents (max 10 MB per file)'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  {t('form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Complaint Tab */}
        <TabsContent value="track">
          <Card>
            <CardHeader>
              <CardTitle>{t('trackComplaint')}</CardTitle>
              <CardDescription>
                {locale === 'fr'
                  ? 'Entrez votre numéro de suivi pour vérifier le statut de votre réclamation'
                  : 'Enter your tracking number to check the status of your complaint'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="trackingNumber">{t('trackingNumber')}</Label>
                    <Input id="trackingNumber" placeholder="RDC-2024-XXXXX" className="font-mono" />
                  </div>
                  <div className="self-end">
                    <Button type="submit">
                      <Search className="mr-2 h-4 w-4" />
                      {tCommon('search')}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Example Status Display (would be dynamic in production) */}
              <div className="mt-8 hidden" id="complaint-status">
                <div className="rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-sm text-gray-500">
                        {locale === 'fr' ? 'Numéro de suivi' : 'Tracking Number'}
                      </p>
                      <p className="font-mono text-lg font-semibold">RDC-2024-00123</p>
                    </div>
                    <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
                      <Clock className="mr-1 h-3 w-3" />
                      {t('status.processing')}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        {locale === 'fr' ? 'Objet' : 'Subject'}
                      </p>
                      <p className="text-gray-900">
                        {locale === 'fr'
                          ? 'Retard dans les travaux de construction'
                          : 'Delay in construction work'}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        {locale === 'fr' ? 'Catégorie' : 'Category'}
                      </p>
                      <p className="text-gray-900">{t('categories.delay')}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        {locale === 'fr' ? 'Date de soumission' : 'Submission Date'}
                      </p>
                      <p className="text-gray-900">
                        {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Status Timeline */}
                    <div className="border-t pt-4">
                      <p className="mb-3 text-sm font-medium text-gray-700">
                        {locale === 'fr' ? 'Historique' : 'Timeline'}
                      </p>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t('status.received')}</p>
                            <p className="text-xs text-gray-500">
                              {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                              <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t('status.processing')}</p>
                            <p className="text-xs text-gray-500">
                              {locale === 'fr' ? 'En cours' : 'In progress'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 opacity-50">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                              <CheckCircle2 className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t('status.resolved')}</p>
                            <p className="text-xs text-gray-500">
                              {locale === 'fr' ? 'En attente' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Information Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CheckCircle2 className="mb-2 h-8 w-8 text-green-600" />
            <CardTitle className="text-lg">{t('status.received')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {locale === 'fr'
                ? 'Votre réclamation a été reçue et un numéro de suivi vous a été attribué.'
                : 'Your complaint has been received and assigned a tracking number.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="mb-2 h-8 w-8 text-yellow-600" />
            <CardTitle className="text-lg">{t('status.processing')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {locale === 'fr'
                ? 'Notre équipe examine votre réclamation et recueille les informations nécessaires.'
                : 'Our team is reviewing your complaint and gathering necessary information.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CheckCircle2 className="mb-2 h-8 w-8 text-blue-600" />
            <CardTitle className="text-lg">{t('status.resolved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {locale === 'fr'
                ? 'Votre réclamation a été traitée et vous recevrez une réponse détaillée.'
                : 'Your complaint has been processed and you will receive a detailed response.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
