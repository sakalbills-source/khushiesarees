/**
 * Pre-launch newsletter block.
 *
 * There is deliberately no email input here yet. The previous version accepted
 * an address, discarded it, and told the visitor "Thank you for subscribing!
 * Check your inbox." — a promise the site could not keep.
 *
 * To re-enable capture: add a subscribe endpoint (email provider or a
 * `newsletter_subscribers` table), then restore the form so that the success
 * message renders only after the server confirms the address was stored.
 */
export default function Newsletter() {
  return (
    <section className="bg-charcoal text-white py-16">
      <div className="container-px max-w-2xl text-center">
        <h2 className="font-serif text-3xl text-gold mb-3">Join the KSarees Family</h2>
        <p className="text-gray-300">
          Our boutique is still being prepared. Sign-ups for early access to new
          collections, exclusive offers and styling tips open when the first
          collection goes live.
        </p>
      </div>
    </section>
  );
}
