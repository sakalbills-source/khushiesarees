const testimonials = [
  {
    name: 'Priya S.',
    location: 'New Jersey, USA',
    text: 'The Kanjeevaram saree exceeded my expectations. Beautiful quality and it arrived in just a week. Will order again!',
  },
  {
    name: 'Anita R.',
    location: 'London, UK',
    text: 'Ordered a bridal lehenga for my sister. The custom stitching was perfect and the fabric is stunning in person.',
  },
  {
    name: 'Meera K.',
    location: 'Auckland, NZ',
    text: 'Fast worldwide shipping and gorgeous suits. KSarees is now my go-to for every festival.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-px">
        <h2 className="font-serif text-3xl text-center mb-2">Loved Worldwide</h2>
        <p className="text-center text-gray-500 mb-10">
          What our customers across the globe are saying
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm"
            >
              <div className="text-gold text-lg mb-3">★★★★★</div>
              <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                “{t.text}”
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-semibold text-charcoal">{t.name}</span>
                <span className="text-gray-500"> — {t.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
