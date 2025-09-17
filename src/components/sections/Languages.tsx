import usaFlag from "../../assets/usa.png";
import indiaFlag from "../../assets/india.png";

const languageNames = [
  "English",
  "हिंदी",
  "తెలుగు",
  "தமிழ்",
  "ಕನ್ನಡ",
  "മലയാളം",
  "ਪੰਜਾਬੀ",
  "मराठी",
  "বাংলা"
];

const languages = languageNames.map((name) => ({
  flag: name === "English" ? usaFlag : indiaFlag,
  name,
}));

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
              className="group bg-gradient-card rounded-xl p-4 text-center shadow-NavBus-soft hover:shadow-NavBus-medium transition-NavBus hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
            >
              <div className="mb-2 group-hover:scale-110 transition-NavBus">
                <img
                  src={language.flag}
                  alt={language.name}
                  className="w-8 h-8 mx-auto"
                />
              </div>
              <p className="text-sm font-medium">{language.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
