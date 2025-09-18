import { MapPin } from 'lucide-react';

const languages = [
  { flag: "🇬🇧", name: "English", country: "UK" },
  { flag: "🇮🇳", name: "हिंदी", country: "India" },
  { flag: "🇮🇳", name: "తెలుగు", country: "India" },
  { flag: "🇮🇳", name: "தமிழ்", country: "India" },
  { flag: "🇮🇳", name: "ಕನ್ನಡ", country: "India" },
  { flag: "🇮🇳", name: "മലയാളം", country: "India" },
  { flag: "🇮🇳", name: "ਪੰਜਾਬੀ", country: "India" },
  { flag: "🇮🇳", name: "मराठी", country: "India" },
  { flag: "🇮🇳", name: "বাংলা", country: "India" }
];

export function Languages() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Speak Your Language
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            NavBus supports 9 major Indian languages, ensuring everyone can travel with confidence
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {languages.map((language, index) => (
            <div
              key={index}
              className="group bg-gradient-card rounded-xl p-4 text-center shadow-navbus-soft hover:shadow-navbus-medium transition-navbus hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-navbus">{language.flag}</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{language.country}</span>
              </div>
              <p className="text-sm font-medium">{language.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}