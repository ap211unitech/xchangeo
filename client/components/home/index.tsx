import { ArrowRight, ArrowUpRight, BarChart3, Coins, Shield, TrendingUp, Zap } from "lucide-react";

import { Button, Card, CardContent } from "@/components/ui";

export const Home = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Swaps",
      description: "Execute trades in milliseconds with our optimized AMM algorithm",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Trustless",
      description: "Non-custodial trading with smart contract security",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Deep Liquidity",
      description: "Access to deep liquidity pools for minimal slippage",
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Multi-Asset Support",
      description: "Trade hundreds of tokens across multiple networks",
    },
  ];

  const stats = [
    { value: "$2.4B+", label: "Total Volume Traded" },
    { value: "150K+", label: "Active Users" },
    { value: "500+", label: "Supported Tokens" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.645_0.246_5.439_/_0.2),transparent_50%)]"></div>
        <div className="bg-primary/15 absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        <div
          className="bg-primary/10 absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-primary/5 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative z-10 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="animate-fade-in-up">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              The Future of
              <span className="text-primary block">Decentralized Trading</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-300 md:text-2xl">
              Experience seamless AMM-based trading with lightning-fast swaps, deep liquidity, and zero intermediaries
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="group bg-primary shadow-primary/25 hover:bg-primary/80 px-8 py-6 text-lg font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105">
                Start Trading
                <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="border-gray-600 px-8 py-6 text-lg font-semibold text-white hover:bg-gray-800">
                Learn More
              </Button>
            </div>
          </div>

          {/* Trading Interface Preview */}
          <div className="relative mt-16">
            <Card className="mx-auto max-w-md border-gray-700/50 bg-gray-900/50 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-left">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quick Swap</h3>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-800/50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-400">From</span>
                        <span className="text-sm text-gray-400">Balance: 1.234</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                        <span className="font-semibold">ETH</span>
                        <span className="ml-auto text-2xl">1.0</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                        <ArrowUpRight className="h-5 w-5 text-black" />
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-800/50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-gray-400">To</span>
                        <span className="text-sm text-gray-400">Balance: 0.000</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                        <span className="font-semibold">USDC</span>
                        <span className="ml-auto text-2xl">2,847.52</span>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/80 w-full py-3 font-semibold text-black transition-transform hover:scale-[1.02]">
                      Swap Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <Card className="hover:shadow-primary/10 border-gray-700/50 bg-gray-900/50 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-primary mb-2 text-3xl font-bold md:text-4xl">{stat.value}</div>
                    <div className="text-sm text-gray-400 md:text-base">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Why Choose Xchangeo?</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">Built for traders who demand speed, security, and seamless user experience</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <Card className="hover:shadow-primary/10 border-gray-700/50 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-primary mb-4 transition-transform group-hover:scale-110">{feature.icon}</div>
                    <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="from-primary/10 to-primary/5 border-gray-700/50 bg-gradient-to-r backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Ready to Start Trading?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
                Join thousands of traders who trust Xchangeo for their DeFi trading needs
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button className="group bg-primary shadow-primary/25 hover:bg-primary/80 px-8 py-6 text-lg font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105">
                  Launch App
                  <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="border-gray-600 px-8 py-6 text-lg font-semibold text-white hover:bg-gray-800">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <TrendingUp className="h-5 w-5 text-black" />
              </div>
              <span className="text-primary text-2xl font-bold">Xchangeo</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Xchangeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
