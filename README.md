# Projeto Chatbot com RabbitMQ e Crew AI

Este projeto implementa um sistema de chatbot usando RabbitMQ e Crew AI para gerenciar a comunicação entre os usuários e a LLM (Large Language Model). O objetivo é criar um chatbot robusto e escalável que possa interagir com múltiplos usuários simultaneamente, mantendo o contexto de cada conversa individualmente e gerenciando filas específicas para cada usuário.

## Funcionalidades Principais

### Isolamento de Contexto
- Cada usuário possui uma fila exclusiva de mensagens, garantindo que o contexto e a memória das conversas sejam mantidos separadamente.

### Gerenciamento de Inatividade
- Implementação de um sistema de monitoramento que finaliza as filas após um período de inatividade, otimizando o uso de recursos.

### Escalabilidade
- Utilização de RabbitMQ para escalabilidade horizontal, permitindo que múltiplos consumidores processem mensagens em paralelo.

### Persistência de Mensagens
- Uso de Redis para armazenar o estado e o contexto das conversas, garantindo persistência entre sessões.

![image](https://github.com/user-attachments/assets/cb44ccc6-a52f-4e2e-a372-17247c5f4ae7)
