import { MapPin, Users, Globe, Smartphone, MessageSquare, Leaf } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Get live location updates and accurate ETAs for all buses. Never waste time waiting at bus stops again."
  },
  {
    icon: Users,
    title: "Crowd Estimation",
    description: "See how crowded buses are before boarding. Choose the most comfortable option for your journey."
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Access navbus in 9 Indian languages, making public transport accessible to everyone."
  },
  {
    icon: Smartphone,
    title: "Offline Support",
    description: "Low bandwidth friendly with offline schedule access. Works even in areas with poor connectivity."
  },
  {
    icon: MessageSquare,
    title: "SMS Updates",
    description: "Get bus information via SMS for users without smartphones or data access."
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Promote sustainable transport and reduce carbon footprint by optimizing public transport usage."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Revolutionary Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            navbus combines cutting-edge technology with user-centric design to transform your travel experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-card rounded-2xl p-6 shadow-navbus-soft hover:shadow-navbus-medium transition-navbus hover:-translate-y-2"
            >
              <div className="bg-gradient-primary rounded-xl w-14 h-14 flex items-center justify-center mb-6 group-hover:shadow-navbus-glow transition-navbus">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}