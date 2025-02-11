from django.db import models


class Employee(models.Model):
    first_name = models.CharField(max_length=100, verbose_name='Nome')
    last_name = models.CharField(max_length=100, verbose_name='Sobrenome')
    cpf = models.CharField(max_length=11, unique=True, verbose_name='CPF')
    email = models.EmailField(verbose_name='E-mail')
    phone = models.CharField(max_length=15, verbose_name='Telefone')
    emergency_contact = models.CharField(max_length=15, verbose_name='Telefone de emergência')
    address = models.TextField(max_length=200, verbose_name='Endereço')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de criação')

    def __str__(self):
        return self.first_name + ' ' + self.last_name
