import Image from "next/image";
import Link from "next/link";
import {AuthButton} from "@/components/auth-button";
import {LanguageSwitcher} from "@/components/language-switcher";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Code2, Database, Globe, Palette, Shield, Zap} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {parseLocaleParams} from "@/lib/i18n/server";

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const locale = await parseLocaleParams(params);
  const t = await getTranslations({locale, namespace: 'Home'});

  const features = [
    {
      icon: Globe,
      title: t('i18nTitle'),
      description: t('i18nDesc'),
    },
    {
      icon: Shield,
      title: t('authTitle'),
      description: t('authDesc'),
    },
    {
      icon: Palette,
      title: t('uiTitle'),
      description: t('uiDesc'),
    },
    {
      icon: Code2,
      title: t('typesafeTitle'),
      description: t('typesafeDesc'),
    },
    {
      icon: Zap,
      title: t('performanceTitle'),
      description: t('performanceDesc'),
    },
    {
      icon: Database,
      title: t('databaseTitle'),
      description: t('databaseDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
            <Badge variant="secondary" className="text-xs">v15</Badge>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container max-w-screen-2xl px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">
            {t('subtitle')}
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t('description')}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard" className="gap-2">
                <Zap className="h-4 w-4" />
                {t('viewDashboard')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a 
                href="https://github.com/Enescyc/-nextjs-i18n-authjs-starter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Code2 className="h-4 w-4" />
                {t('githubRepo')}
              </a>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="mx-auto mt-24 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {t('features')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuresDesc')}
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mx-auto mt-24 max-w-4xl">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('techStack')}</CardTitle>
              <CardDescription>
                {t('techStackDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Next.js 15',
                  'TypeScript',
                  'NextAuth.js',
                  'next-intl',
                  'Prisma',
                  'shadcn/ui',
                  'Tailwind CSS',
                  'Radix UI',
                  'Lucide Icons'
                ].map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 rounded-lg border p-3"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mx-auto mt-24 max-w-4xl text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t('ctaDesc')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    {t('getStarted')}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a 
                    href="https://github.com/Enescyc/-nextjs-i18n-authjs-starter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {t('viewGithub')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-24">
        <div className="container max-w-screen-2xl px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
              />
              <span className="text-sm text-muted-foreground">
                i18n Auth Starter
              </span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('documentation')}
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/Enescyc/-nextjs-i18n-authjs-starter/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('issues')}
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/Enescyc/-nextjs-i18n-authjs-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('github')}
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              {t('footerText')}
              <a href="https://github.com/Enescyc/-nextjs-i18n-authjs-starter" className="underline hover:text-foreground ml-1">
                {t('openSource')}
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}