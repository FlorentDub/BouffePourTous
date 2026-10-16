import type { Resource } from "../lib/types"
import { TYPE_MAP } from "../lib/translate"

export const resolveTypeKeyStatic = (r: Resource): string => {
  const fr = (r.type_fr || "").trim()
  const en = (r.type_en || "").trim()
  for (const [key, labels] of Object.entries(TYPE_MAP)) {
    if (fr === labels.fr || en === labels.en) return key
  }
  return ""
}

export default function StaticResourceList({
  resources,
  lang,
}: {
  resources: Resource[]
  lang: "fr" | "en"
}) {
  const pick = (fr: string | undefined, en: string | undefined) =>
    (lang === "en" ? en || fr : fr || en) || ""

  if (resources.length === 0) {
    return (
      <p className="text-center text-muted py-8">
        {lang === "fr"
          ? "Aucune ressource pour cette ville."
          : "No resource for this city."}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {resources.map((r) => {
        const key = resolveTypeKeyStatic(r)
        const typeLabel = key
          ? lang === "fr"
            ? TYPE_MAP[key].fr
            : TYPE_MAP[key].en
          : pick(r.type_fr, r.type_en)
        const address = [r.numero, r.rue].filter(Boolean).join(" ")
        const description = pick(r.description_fr, r.description_en)
        const horaire = pick(r.horaire_fr, r.horaire_en)
        const conditions = pick(r.conditions_fr, r.conditions_en)
        return (
          <li key={r.id} className="bg-white rounded-2xl border border-line p-4">
            <article>
              <h3 className="font-semibold text-ink">
                {pick(r.name_fr, r.name_en)}
              </h3>
              <p className="text-sm text-primary">{typeLabel}</p>
              {address && (
                <p className="text-sm text-muted">
                  📍 {address}, {r.ville} ({r.code_postal})
                </p>
              )}
              {description && <p className="text-sm mt-2">{description}</p>}
              {horaire && (
                <p className="text-sm mt-1">
                  🕒{" "}
                  <strong>{lang === "fr" ? "Horaires" : "Schedule"}:</strong>{" "}
                  {horaire}
                </p>
              )}
              {conditions && (
                <p className="text-sm mt-1">
                  🚨{" "}
                  <strong>
                    {lang === "fr" ? "Conditions" : "Conditions"}:
                  </strong>{" "}
                  {conditions}
                </p>
              )}
              {r.contact && (
                <p className="text-sm mt-1">
                  🔗{" "}
                  <a
                    href={r.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    {lang === "fr" ? "Voir le lien" : "View link"}
                  </a>
                </p>
              )}
            </article>
          </li>
        )
      })}
    </ul>
  )
}
