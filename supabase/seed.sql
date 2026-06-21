-- ============================================================================
-- KSarees — sample seed data (optional)
-- Run AFTER schema.sql. The app also ships with built-in mock data, so this is
-- only needed if you want real rows in Supabase to edit via the admin panel.
-- ============================================================================

insert into products (name, sku, description, price, images, category, fabric, size_guide, in_stock) values
('Royal Kanjeevaram Silk Saree', 'SAR-001', 'Premium silk Kanjeevaram saree with zari border.', 3499,
  array['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'], 'saree', 'Silk',
  'Blouse: Unstitched (0.8m) | Saree length: 5.5m.', true),
('Banarasi Zari Bridal Saree', 'SAR-002', 'Handwoven Banarasi saree with intricate zari work.', 4249,
  array['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'], 'saree', 'Banarasi',
  'Blouse: Unstitched (0.8m) | Saree length: 5.5m.', true),
('Bridal Velvet Lehenga Choli', 'LEH-001', 'Heavily embroidered bridal velvet lehenga.', 8999,
  array['https://images.unsplash.com/photo-1610189844877-1c5b6c0c2d8e?w=800&q=80'], 'lehenga', 'Velvet',
  'Sizes XS-XXL. Custom sizing available.', true),
('Sequin Net Reception Lehenga', 'LEH-002', 'Glamorous sequin net lehenga for receptions.', 9749,
  array['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'], 'lehenga', 'Net',
  'Sizes XS-XXL. Custom sizing available.', true),
('Anarkali Embroidered Suit Set', 'SUT-001', 'Floor-length Anarkali suit with dupatta.', 2799,
  array['https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80'], 'suit', 'Cotton',
  'Sizes XS-XXL. Custom sizing available.', true),
('Cotton Printed Palazzo Suit', 'SUT-002', 'Comfortable cotton palazzo suit set.', 3549,
  array['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80'], 'suit', 'Georgette',
  'Sizes XS-XXL. Custom sizing available.', true),
('Block Print Cotton Kurti', 'KUR-001', 'Hand block printed everyday cotton kurti.', 1299,
  array['https://images.unsplash.com/photo-1614093302611-8ef9b9d8b8c0?w=800&q=80'], 'kurti', 'Cotton',
  'Sizes XS-XXL. Custom sizing available.', true),
('Embroidered A-Line Kurti', 'KUR-002', 'Elegant A-line kurti with thread embroidery.', 2049,
  array['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'], 'kurti', 'Linen',
  'Sizes XS-XXL. Custom sizing available.', true),
('Silk Sherwani Wedding Set', 'MEN-001', 'Regal silk sherwani with churidar.', 3999,
  array['https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=800&q=80'], 'mens', 'Silk',
  'Sizes XS-XXL. Custom sizing available.', true),
('Cotton Kurta Pajama Set', 'MEN-002', 'Classic cotton kurta pajama for festivities.', 4749,
  array['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'], 'mens', 'Cotton',
  'Sizes XS-XXL. Custom sizing available.', true)
on conflict (sku) do nothing;
