from django.test import TestCase
from django.urls import reverse


class HomePageTests(TestCase):
    def test_home_page_status_code(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)

    def test_home_page_template(self):
        response = self.client.get(reverse("home"))
        self.assertTemplateUsed(response, "home.html")

    def test_CalcBobina_code(self):
        response = self.client.get(reverse("calc_bobina"))
        self.assertEqual(response.status_code, 200)

    def test_CalcBobina_template(self):
        response = self.client.get(reverse("calc_bobina"))
        self.assertTemplateUsed(response, "CalcBobina.html")

    def test_CalcMetro_code(self):
        response = self.client.get(reverse("calc_metro"))
        self.assertEqual(response.status_code, 200)

    def test_CalcMetro_template(self):
        response = self.client.get(reverse("calc_metro"))
        self.assertTemplateUsed(response, "CalcMetro.html")
