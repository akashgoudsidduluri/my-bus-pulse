import { Heart, DollarSign, Globe2 } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Social Impact",
    description: "Increased accessibility for all communities, including rural passengers, elderly users, and non-English speakers. Breaking down barriers to public transport.",
    gradient: "bg-gradient-secondary"
  },
  {
    icon: DollarSign,
    title: "Economic Impact", 
    description: "Passengers save time and money while governments and operators reduce inefficiencies and operational costs through optimized fleet management.",
    gradient: "bg-gradient-primary"
  },
  {
    icon: Globe2,
    title: "Environmental Impact",
    description: "Promotes eco-friendly travel habits by reducing traffic congestion and pollution. Encourages shift from private to public transportation.",
    gradient: "bg-safari-green"
  }
];

export function Benefits() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Triple Impact Solution
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Safari delivers measurable benefits across social, economic, and environmental dimensions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group text-center bg-gradient-card rounded-2xl p-8 shadow-safari-soft hover:shadow-safari-large transition-safari hover:-translate-y-2"
            >
              <div className={`${benefit.gradient} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-safari-glow transition-safari`}>
                <benefit.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}