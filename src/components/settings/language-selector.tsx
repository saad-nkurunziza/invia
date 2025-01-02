import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "jp", name: "Japanese", flag: "🇯🇵" },
  ];

export default function LanguageSelector() {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none text-foreground">
        Server location
      </legend>
      <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Default landing section:" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>{lang.flag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
    </fieldset>
  );
}
